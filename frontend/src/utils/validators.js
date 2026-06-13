export function validateEmail(email) {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return re.test(email)
}

export function validatePassword(password) {
  const errors = []
  
  if (password.length < 6) {
    errors.push('Password must be at least 6 characters')
  }
  if (password.length > 128) {
    errors.push('Password must be less than 128 characters')
  }
  
  return {
    isValid: errors.length === 0,
    errors,
  }
}

export function validateInvoiceNumber(number) {
  const re = /^INV-\d{8}-[A-Z0-9]{4}$/
  return re.test(number)
}

export function validatePhone(phone) {
  if (!phone) return true
  const cleaned = phone.replace(/\D/g, '')
  return cleaned.length >= 10 && cleaned.length <= 15
}

export function validateRequired(value, fieldName) {
  if (!value || (typeof value === 'string' && !value.trim())) {
    return `${fieldName} is required`
  }
  return null
}

export function validateMinLength(value, min, fieldName) {
  if (value && value.length < min) {
    return `${fieldName} must be at least ${min} characters`
  }
  return null
}

export function validateNumber(value, fieldName) {
  if (value && isNaN(value)) {
    return `${fieldName} must be a valid number`
  }
  return null
}