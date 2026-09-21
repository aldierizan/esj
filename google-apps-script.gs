/**
 * EJM registration backend, schema 2 / validation 3.
 * Paste into the Sheet's Apps Script project, run setup() ONCE, then redeploy.
 * Existing columns A:J and existing applicant rows are preserved.
 * Keep this backend in Apps Script; do not put Sheet credentials in frontend code.
 */
const SHEET_NAME = 'Sign Ups';
const TIMEZONE = 'Asia/Jakarta';
const SCHEMA_VERSION = 2;
const VALIDATION_VERSION = 3;
const HEADERS = [
  'Submitted At', 'Nama / Name', 'Tempat Lahir / Birthplace',
  'Tanggal Lahir / Birthday', 'Umur / Age', 'Jenis Kelamin / Gender',
  'WhatsApp No', 'Alamat / Address', 'Pertanyaan / Question', 'Source',
  'Pengalaman Kerja Sebelumnya / Previous Work Experience',
  'Bidang Pekerjaan yang Diminati / Preferred Field of Work',
  'Submission ID'
];

/** Run manually from the editor attached to the applicant Sheet. */
function setup() {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  if (!spreadsheet) throw new Error('Open Apps Script through Extensions > Apps Script in the target Google Sheet, then run setup().');
  PropertiesService.getScriptProperties().setProperty('EJM_SPREADSHEET_ID', spreadsheet.getId());
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);
  try {
    const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
    ensureHeaders(sheet);
    console.log('Setup complete. Redeploy the web app as a new version.');
  } finally { lock.releaseLock(); }
}

/** Public health response contains no applicant data or spreadsheet identifier. */
function doGet() {
  return jsonResponse({ service: 'EJM Registration', schemaVersion: SCHEMA_VERSION, validationVersion: VALIDATION_VERSION });
}
function doPost(e) {
  try {
    if (!e || !e.parameter) return jsonResponse({ success: false, message: 'No form data received.' });
    if (e.postData && e.postData.length > 30000) return jsonResponse({ success: false, message: 'Submission is too long.' });
    const p = e.parameter;
    if (cleanValue(p.website)) return jsonResponse({ success: false, message: 'Unable to accept this submission.' });
    const data = {};
    ['name', 'birthplace', 'birthday', 'age', 'gender', 'whatsapp', 'address', 'question', 'work_experience', 'job_interest'].forEach(function (key) { data[key] = cleanValue(p[key]); });
    const missing = ['name', 'birthplace', 'birthday', 'age', 'gender', 'whatsapp', 'address', 'work_experience', 'job_interest'].filter(function (key) { return !data[key]; });
    if (missing.length) return jsonResponse({ success: false, message: 'Please complete all required fields / Mohon lengkapi semua kolom wajib.', missing: missing });
    const limits = { name: 150, birthplace: 150, birthday: 10, age: 3, gender: 40, whatsapp: 30, address: 2000, question: 3000, work_experience: 3000, job_interest: 300 };
    if (Object.keys(limits).some(function (key) { return data[key].length > limits[key]; })) return jsonResponse({ success: false, message: 'One or more fields are too long.' });
    if (['Laki-laki / Male', 'Perempuan / Female'].indexOf(data.gender) === -1) return jsonResponse({ success: false, message: 'Please select a valid gender.' });
    const birthday = parseBirthday(data.birthday);
    const today = Utilities.formatDate(new Date(), TIMEZONE, 'yyyy-MM-dd');
    if (!birthday || data.birthday > today) return jsonResponse({ success: false, message: 'Please enter a valid birthday.' });
    // Age is mandatory in the form, but the stored value is calculated here, not trusted from the browser.
    if (!/^\d{1,3}$/.test(data.age)) return jsonResponse({ success: false, message: 'Please check your birthday so age can be calculated.' });
    const age = calculateAge(birthday, today);
    const digits = data.whatsapp.replace(/\D/g, '');
    if (!/^[+\d\s()\-]+$/.test(data.whatsapp) || digits.length < 9 || digits.length > 15) return jsonResponse({ success: false, message: 'Please enter a valid WhatsApp number.' });
    const id = cleanValue(p.submission_id) || Utilities.getUuid();
    if (!/^[A-Za-z0-9_-]{12,100}$/.test(id)) return jsonResponse({ success: false, message: 'Invalid submission reference. Please reload the page.' });
    const spreadsheetId = PropertiesService.getScriptProperties().getProperty('EJM_SPREADSHEET_ID');
    if (!spreadsheetId) throw new Error('Run setup() once in the Apps Script editor before deploying.');
    // Active spreadsheet methods are not available in a deployed web app.
    const spreadsheet = SpreadsheetApp.openById(spreadsheetId);
    const lock = LockService.getScriptLock();
    lock.waitLock(10000);
    try {
      const sheet = spreadsheet.getSheetByName(SHEET_NAME) || spreadsheet.insertSheet(SHEET_NAME);
      const headers = ensureHeaders(sheet);
      const idColumn = headers.indexOf('Submission ID') + 1;
      const lastRow = sheet.getLastRow();
      if (lastRow > 1 && sheet.getRange(2, idColumn, lastRow - 1, 1).createTextFinder(id).matchEntireCell(true).findNext()) {
        return jsonResponse({ success: true, schemaVersion: SCHEMA_VERSION, validationVersion: VALIDATION_VERSION, submission_id: id, message: 'Registration already saved.' });
      }
      const values = {
        'Submitted At': new Date(),
        'Nama / Name': safeForSheet(data.name),
        'Tempat Lahir / Birthplace': safeForSheet(data.birthplace),
        'Tanggal Lahir / Birthday': data.birthday,
        'Umur / Age': age,
        'Jenis Kelamin / Gender': safeForSheet(data.gender),
        'WhatsApp No': safeForSheet(data.whatsapp),
        'Alamat / Address': safeForSheet(data.address),
        'Pertanyaan / Question': safeForSheet(data.question),
        'Source': 'EJM Website Sign Up Form',
        'Pengalaman Kerja Sebelumnya / Previous Work Experience': safeForSheet(data.work_experience),
        'Bidang Pekerjaan yang Diminati / Preferred Field of Work': safeForSheet(data.job_interest),
        'Submission ID': id
      };
      const row = headers.map(function (header) { return Object.prototype.hasOwnProperty.call(values, header) ? values[header] : ''; });
      const rowIndex = lastRow + 1;
      if (rowIndex > sheet.getMaxRows()) sheet.insertRowsAfter(sheet.getMaxRows(), 1);
      // Set text formats BEFORE saving so leading zeroes are not lost.
      ['Tanggal Lahir / Birthday', 'WhatsApp No', 'Submission ID'].forEach(function (header) { sheet.getRange(rowIndex, headers.indexOf(header) + 1).setNumberFormat('@'); });
      sheet.getRange(rowIndex, headers.indexOf('Submitted At') + 1).setNumberFormat('dd mmm yyyy hh:mm:ss');
      sheet.getRange(rowIndex, 1, 1, row.length).setValues([row]);
      SpreadsheetApp.flush();
      return jsonResponse({ success: true, schemaVersion: SCHEMA_VERSION, validationVersion: VALIDATION_VERSION, submission_id: id, message: 'Registration saved.' });
    } finally { lock.releaseLock(); }
  } catch (error) {
    console.error(error.message); // No raw applicant data in logs.
    return jsonResponse({ success: false, message: 'The registration service is temporarily unavailable. Please contact our team / Layanan pendaftaran belum tersedia. Silakan hubungi tim kami.' });
  }
}

/** Append missing headers only. Never move or rewrite existing applicant rows. */
function ensureHeaders(sheet) {
  let headers = sheet.getLastRow() ? sheet.getRange(1, 1, 1, Math.max(1, sheet.getLastColumn())).getValues()[0].map(cleanValue) : [];
  const nonempty = headers.filter(Boolean);
  if (new Set(nonempty).size !== nonempty.length) throw new Error('Duplicate column headers found. Resolve them before accepting registrations.');
  if (sheet.getLastRow() > 1 && !HEADERS.slice(0, 10).every(function (header) { return headers.indexOf(header) !== -1; })) {
    throw new Error('Existing sheet headers do not match the original form. Review the headers manually; no existing records were changed.');
  }
  const missing = HEADERS.filter(function (header) { return headers.indexOf(header) === -1; });
  if (missing.length) {
    const firstNewColumn = headers.length + 1;
    const total = headers.length + missing.length;
    if (total > sheet.getMaxColumns()) sheet.insertColumnsAfter(sheet.getMaxColumns(), total - sheet.getMaxColumns());
    sheet.getRange(1, firstNewColumn, 1, missing.length).setValues([missing]).setFontWeight('bold').setBackground('#083d82').setFontColor('#ffffff');
    headers = headers.concat(missing);
    sheet.setFrozenRows(1);
  }
  return headers;
}
function cleanValue(value) { return String(value == null ? '' : value).trim(); }
function safeForSheet(value) {
  const text = cleanValue(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}
function parseBirthday(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;
  const year = Number(match[1]), month = Number(match[2]), day = Number(match[3]);
  const check = new Date(0);
  check.setUTCFullYear(year, month - 1, day);
  check.setUTCHours(0, 0, 0, 0);
  return check.getUTCFullYear() === year && check.getUTCMonth() === month - 1 && check.getUTCDate() === day ? { year: year, month: month, day: day } : null;
}
function calculateAge(birthday, todayISO) {
  const parts = todayISO.split('-').map(Number);
  return parts[0] - birthday.year - ((parts[1] < birthday.month || (parts[1] === birthday.month && parts[2] < birthday.day)) ? 1 : 0);
}
function jsonResponse(payload) { return ContentService.createTextOutput(JSON.stringify(payload)).setMimeType(ContentService.MimeType.JSON); }
