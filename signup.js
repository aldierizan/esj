/* Registration validation + confirmed Google Apps Script submission. */
(() => {
  'use strict';
  const form = document.getElementById('signup-form');
  if (!form) return;
  const birthdayInput = form.elements.birthday;
  const ageInput = form.elements.age;
  const whatsappInput = form.elements.whatsapp;
  const submitButton = form.querySelector('button[type="submit"]');
  const submitLabel = submitButton.querySelector('.submit-label');
  const statusBox = document.getElementById('form-status');
  const requiredFields = ['name', 'birthplace', 'birthday', 'age', 'gender', 'whatsapp', 'address', 'work_experience', 'job_interest'];
  const fieldLimits = { name: 150, birthplace: 150, whatsapp: 30, address: 2000, question: 3000, work_experience: 3000, job_interest: 300 };
  let sending = false;
  let submissionId = '';
  let lastSignature = '';

  const dateParts = (date) => [date.getFullYear(), date.getMonth() + 1, date.getDate()];
  const localISODate = () => dateParts(new Date()).map((part, i) => i ? String(part).padStart(2, '0') : part).join('-');
  function calculateAge(value) {
    const parts = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value);
    if (!parts) return '';
    const [year, month, day] = parts.slice(1).map(Number);
    const birth = new Date(0);
    birth.setFullYear(year, month - 1, day);
    birth.setHours(0, 0, 0, 0);
    if (birth.getFullYear() !== year || birth.getMonth() !== month - 1 || birth.getDate() !== day || value > localISODate()) return '';
    const today = dateParts(new Date());
    return today[0] - year - ((today[1] < month || (today[1] === month && today[2] < day)) ? 1 : 0);
  }
  function updateAge() {
    birthdayInput.max = localISODate();
    ageInput.value = calculateAge(birthdayInput.value);
  }
  updateAge();
  birthdayInput.addEventListener('input', updateAge);
  birthdayInput.addEventListener('change', () => { updateAge(); clearError('birthday'); clearError('age'); });
  window.addEventListener('pageshow', updateAge);
  whatsappInput.addEventListener('input', () => {
    whatsappInput.value = whatsappInput.value.replace(/[^0-9+()\-\s]/g, '');
  });

  function setError(name, message) {
    const field = form.elements[name];
    const error = form.querySelector(`[data-error-for="${name}"]`);
    field?.classList.add('is-invalid');
    field?.setAttribute('aria-invalid', 'true');
    if (error) error.textContent = message;
  }
  function clearError(name) {
    form.elements[name]?.classList.remove('is-invalid');
    form.elements[name]?.removeAttribute('aria-invalid');
    const error = form.querySelector(`[data-error-for="${name}"]`);
    if (error) error.textContent = '';
  }
  function showStatus(type, message) {
    statusBox.className = `form-status show ${type}`;
    statusBox.textContent = message;
  }
  form.querySelectorAll('input, select, textarea').forEach((field) => {
    field.addEventListener('input', () => clearError(field.name));
    field.addEventListener('change', () => clearError(field.name));
  });
  function validate() {
    updateAge();
    const names = new Set([...requiredFields, ...Object.keys(fieldLimits)]);
    names.forEach(clearError);
    let valid = true;
    const fail = (name, message) => { valid = false; setError(name, message); };
    requiredFields.forEach((name) => {
      if (!String(form.elements[name].value).trim()) fail(name, 'This field is required / Wajib diisi.');
    });
    if (birthdayInput.value && ageInput.value === '') fail('birthday', 'Please enter a valid birthday / Masukkan tanggal lahir yang valid.');
    const digits = whatsappInput.value.replace(/\D/g, '');
    if (whatsappInput.value && (digits.length < 9 || digits.length > 15)) fail('whatsapp', 'Please enter a valid WhatsApp number / Masukkan nomor WhatsApp yang valid.');
    Object.entries(fieldLimits).forEach(([name, limit]) => {
      if (form.elements[name].value.length > limit) fail(name, `Maximum ${limit} characters / Maksimum ${limit} karakter.`);
    });
    return valid;
  }
  const newSubmissionId = () => {
    if (window.crypto?.randomUUID) return window.crypto.randomUUID();
    if (window.crypto?.getRandomValues) return Array.from(window.crypto.getRandomValues(new Uint8Array(16)), (x) => x.toString(16).padStart(2, '0')).join('');
    return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  };
  form.addEventListener('submit', async (event) => {
    event.preventDefault();
    if (sending) return;
    if (!validate()) {
      showStatus('error', 'Please complete the required fields correctly / Mohon lengkapi kolom wajib dengan benar.');
      form.querySelector('.is-invalid')?.focus();
      return;
    }
    let endpoint;
    try {
      endpoint = new URL(form.dataset.endpoint);
      if (endpoint.protocol !== 'https:' || endpoint.hostname !== 'script.google.com' || !/^\/macros\/s\/[^/]+\/exec$/.test(endpoint.pathname)) throw new Error();
    } catch (_) {
      showStatus('error', 'Registration is not connected yet. Please contact our team on WhatsApp. / Formulir belum terhubung. Silakan hubungi tim kami melalui WhatsApp.');
      return;
    }
    const payload = new URLSearchParams(new FormData(form));
    const signature = payload.toString();
    if (!submissionId || signature !== lastSignature) submissionId = newSubmissionId();
    lastSignature = signature;
    payload.set('submission_id', submissionId);
    sending = true;
    submitButton.disabled = true;
    submitLabel.textContent = 'Submitting...';
    form.setAttribute('aria-busy', 'true');
    showStatus('pending', 'Submitting your registration / Mengirim pendaftaran...');
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 45000);
    try {
      // URLSearchParams uses form encoding: no JSON preflight, no opaque no-cors response.
      const response = await fetch(endpoint.href, {
        method: 'POST',
        body: payload,
        mode: 'cors',
        credentials: 'omit',
        redirect: 'follow',
        signal: controller.signal
      });
      if (!response.ok) throw new Error('Response not readable.');
      const result = await response.json();
      if (result.success === false) {
        const message = typeof result.message === 'string' ? result.message : 'Please check your details and try again.';
        showStatus('error', message);
        return;
      }
      // Do not report a save unless the backend confirms the current schema and mandatory-field rules.
      if (result.success !== true || result.schemaVersion !== 2 || result.validationVersion !== 3 || result.submission_id !== submissionId) throw new Error('Unconfirmed save.');
      form.reset();
      updateAge();
      submissionId = '';
      lastSignature = '';
      showStatus('success', 'Registration saved successfully. Thank you! / Pendaftaran berhasil disimpan. Terima kasih!');
      statusBox.focus({ preventScroll: true });
      statusBox.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'instant' : 'smooth', block: 'center' });
    } catch (_) {
      // A lost response does not prove the server failed to save. Keep fields and retry ID.
      showStatus('error', 'We could not confirm whether your registration was saved. Your entries are still here. Please contact our team before submitting again. / Status penyimpanan belum dapat dikonfirmasi. Data isian tetap tersedia. Hubungi tim kami sebelum mengirim ulang.');
    } finally {
      clearTimeout(timeout);
      sending = false;
      submitButton.disabled = false;
      submitLabel.textContent = 'Submit Registration';
      form.removeAttribute('aria-busy');
    }
  });
})();
