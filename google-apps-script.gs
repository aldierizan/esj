const SHEET_NAME = 'Sign Ups';
const TIMEZONE = 'Asia/Jakarta';

function doPost(e) {
  try {
    if (!e || !e.parameter) {
      return jsonResponse({ success: false, message: 'No form data received.' });
    }

    // Honeypot spam protection.
    if (String(e.parameter.website || '').trim() !== '') {
      return jsonResponse({ success: true, message: 'Submission received.' });
    }

    const data = {
      name: cleanValue(e.parameter.name),
      birthplace: cleanValue(e.parameter.birthplace),
      birthday: cleanValue(e.parameter.birthday),
      gender: cleanValue(e.parameter.gender),
      whatsapp: cleanValue(e.parameter.whatsapp),
      address: cleanValue(e.parameter.address),
      question: cleanValue(e.parameter.question),
      source: cleanValue(e.parameter.source || 'EJM Website Sign Up Form')
    };

    const required = ['name', 'birthplace', 'birthday', 'gender', 'whatsapp', 'address'];
    const missing = required.filter((key) => !data[key]);
    if (missing.length) {
      return jsonResponse({
        success: false,
        message: 'Missing required fields.',
        missing: missing
      });
    }

    const birthday = parseBirthday(data.birthday);
    if (!birthday) {
      return jsonResponse({ success: false, message: 'Invalid birthday.' });
    }

    const age = calculateAge(birthday, new Date());
    if (age < 0) {
      return jsonResponse({ success: false, message: 'Invalid age.' });
    }

    const whatsappDigits = data.whatsapp.replace(/\D/g, '');
    if (whatsappDigits.length < 9 || whatsappDigits.length > 15) {
      return jsonResponse({ success: false, message: 'Invalid WhatsApp number.' });
    }

    const lock = LockService.getScriptLock();
    lock.waitLock(10000);

    try {
      const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
      if (!spreadsheet) {
        throw new Error('This Apps Script must be bound to a Google Sheet.');
      }

      let sheet = spreadsheet.getSheetByName(SHEET_NAME);
      if (!sheet) {
        sheet = spreadsheet.insertSheet(SHEET_NAME);
      }

      ensureHeader(sheet);

      sheet.appendRow([
        new Date(),
        safeForSheet(data.name),
        safeForSheet(data.birthplace),
        Utilities.formatDate(birthday, TIMEZONE, 'yyyy-MM-dd'),
        age,
        safeForSheet(data.gender),
        safeForSheet(data.whatsapp),
        safeForSheet(data.address),
        safeForSheet(data.question),
        safeForSheet(data.source)
      ]);

      const lastRow = sheet.getLastRow();
      sheet.getRange(lastRow, 1).setNumberFormat('dd mmm yyyy hh:mm:ss');
      sheet.getRange(lastRow, 4).setNumberFormat('@');
      sheet.getRange(lastRow, 7).setNumberFormat('@');

      return jsonResponse({ success: true, message: 'Registration saved.' });
    } finally {
      lock.releaseLock();
    }
  } catch (error) {
    console.error(error);
    return jsonResponse({ success: false, message: 'Server error.' });
  }
}

function ensureHeader(sheet) {
  const headers = [
    'Submitted At',
    'Nama / Name',
    'Tempat Lahir / Birthplace',
    'Tanggal Lahir / Birthday',
    'Umur / Age',
    'Jenis Kelamin / Gender',
    'WhatsApp No',
    'Alamat / Address',
    'Pertanyaan / Question',
    'Source'
  ];

  if (sheet.getLastRow() === 0) {
    sheet.appendRow(headers);
    const headerRange = sheet.getRange(1, 1, 1, headers.length);
    headerRange.setFontWeight('bold');
    headerRange.setBackground('#083d82');
    headerRange.setFontColor('#ffffff');
    sheet.setFrozenRows(1);
  }
}

function cleanValue(value) {
  return String(value == null ? '' : value).trim();
}

// Prevent user input from being interpreted as a spreadsheet formula.
function safeForSheet(value) {
  const text = cleanValue(value);
  return /^[=+\-@]/.test(text) ? "'" + text : text;
}

function parseBirthday(value) {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
  if (!match) return null;

  const year = Number(match[1]);
  const month = Number(match[2]);
  const day = Number(match[3]);
  const date = new Date(year, month - 1, day, 12, 0, 0);

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    return null;
  }

  return date;
}

function calculateAge(birthday, today) {
  let age = today.getFullYear() - birthday.getFullYear();
  const monthDiff = today.getMonth() - birthday.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthday.getDate())) {
    age -= 1;
  }
  return age;
}

function jsonResponse(payload) {
  return ContentService
    .createTextOutput(JSON.stringify(payload))
    .setMimeType(ContentService.MimeType.JSON);
}
