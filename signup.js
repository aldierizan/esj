(() => {
  const form = document.getElementById("signup-form");
  if (!form) return;

  const birthdayInput = document.getElementById("birthday");
  const ageInput = document.getElementById("age");
  const whatsappInput = document.getElementById("whatsapp");
  const submitButton = form.querySelector("button[type='submit']");
  const submitLabel = submitButton.querySelector(".submit-label");
  const statusBox = document.getElementById("form-status");

  const today = new Date();
  birthdayInput.max = [
    today.getFullYear(),
    String(today.getMonth() + 1).padStart(2, "0"),
    String(today.getDate()).padStart(2, "0")
  ].join("-");

  const calculateAge = (dateString) => {
    if (!dateString) return "";
    const birthDate = new Date(`${dateString}T00:00:00`);
    if (Number.isNaN(birthDate.getTime()) || birthDate > today) return "";

    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDiff = today.getMonth() - birthDate.getMonth();
    if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
      age -= 1;
    }
    return age >= 0 ? age : "";
  };

  birthdayInput.addEventListener("change", () => {
    ageInput.value = calculateAge(birthdayInput.value);
    clearFieldError("birthday");
    clearFieldError("age");
  });

  whatsappInput.addEventListener("input", () => {
    whatsappInput.value = whatsappInput.value.replace(/[^0-9+()\-\s]/g, "");
  });

  const requiredFields = [
    "name",
    "birthplace",
    "birthday",
    "age",
    "gender",
    "whatsapp",
    "address"
  ];

  function setFieldError(fieldName, message) {
    const field = form.elements[fieldName];
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (field) field.classList.add("is-invalid");
    if (error) error.textContent = message;
  }

  function clearFieldError(fieldName) {
    const field = form.elements[fieldName];
    const error = form.querySelector(`[data-error-for="${fieldName}"]`);
    if (field) field.classList.remove("is-invalid");
    if (error) error.textContent = "";
  }

  function showStatus(type, message) {
    statusBox.className = `form-status show ${type}`;
    statusBox.textContent = message;
  }

  function clearStatus() {
    statusBox.className = "form-status";
    statusBox.textContent = "";
  }

  requiredFields.forEach((fieldName) => {
    const field = form.elements[fieldName];
    if (!field || field.readOnly) return;
    field.addEventListener("input", () => clearFieldError(fieldName));
    field.addEventListener("change", () => clearFieldError(fieldName));
  });

  function validateForm() {
    let isValid = true;
    requiredFields.forEach(clearFieldError);
    clearStatus();

    requiredFields.forEach((fieldName) => {
      const field = form.elements[fieldName];
      const value = String(field.value || "").trim();
      if (!value) {
        setFieldError(fieldName, "This field is required / Wajib diisi.");
        isValid = false;
      }
    });

    if (birthdayInput.value && !ageInput.value) {
      setFieldError("birthday", "Please enter a valid birthday / Masukkan tanggal lahir yang valid.");
      isValid = false;
    }

    const whatsappDigits = whatsappInput.value.replace(/\D/g, "");
    if (whatsappInput.value && (whatsappDigits.length < 9 || whatsappDigits.length > 15)) {
      setFieldError("whatsapp", "Please enter a valid WhatsApp number / Masukkan nomor WhatsApp yang valid.");
      isValid = false;
    }

    return isValid;
  }

  form.addEventListener("submit", async (event) => {
    event.preventDefault();

    if (!validateForm()) {
      showStatus("error", "Please complete all required fields correctly / Mohon lengkapi semua kolom wajib dengan benar.");
      const firstInvalid = form.querySelector(".is-invalid");
      if (firstInvalid) firstInvalid.focus();
      return;
    }

    const endpoint = form.dataset.endpoint;
    if (!endpoint || endpoint.includes("PASTE_YOUR_GOOGLE_APPS_SCRIPT")) {
      showStatus("error", "Google Sheet connection has not been configured yet. Paste your Google Apps Script Web App URL into signup.html first.");
      return;
    }

    submitButton.disabled = true;
    submitLabel.textContent = "Submitting...";
    clearStatus();

    try {
      const payload = new URLSearchParams(new FormData(form));

      await fetch(endpoint, {
        method: "POST",
        mode: "no-cors",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded;charset=UTF-8"
        },
        body: payload.toString()
      });

      form.reset();
      ageInput.value = "";
      showStatus("success", "Registration submitted successfully. Thank you! / Pendaftaran berhasil dikirim. Terima kasih!");
      statusBox.scrollIntoView({ behavior: "smooth", block: "center" });
    } catch (error) {
      showStatus("error", "We could not submit your registration. Please check your internet connection and try again / Pendaftaran belum berhasil dikirim. Silakan coba lagi.");
    } finally {
      submitButton.disabled = false;
      submitLabel.textContent = "Submit Registration";
    }
  });
})();
