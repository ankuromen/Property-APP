const PHONE_REGEX = /^[6-9]\d{9}$/;

function normalizePhone(raw) {
  return String(raw || '').replace(/\D/g, '').slice(-10);
}

function validateIndianMobile(phone10) {
  return PHONE_REGEX.test(phone10);
}

module.exports = { normalizePhone, validateIndianMobile };

