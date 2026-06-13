export function formatCurrency(amount, currency = 'USD') {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount || 0)
}

export function formatDate(dateString, options = {}) {
  if (!dateString) return '-'
  
  const date = new Date(dateString)
  const defaultOptions = {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  }
  
  return date.toLocaleDateString('en-US', { ...defaultOptions, ...options })
}

export function formatDateTime(dateString) {
  return formatDate(dateString, {
    hour: '2-digit',
    minute: '2-digit',
  })
}

export function formatNumber(num) {
  return new Intl.NumberFormat('en-US').format(num || 0)
}

export function formatPercentage(value) {
  return `${(value || 0).toFixed(1)}%`
}

export function truncate(str, length = 50) {
  if (!str) return ''
  return str.length > length ? str.substring(0, length) + '...' : str
}

export function formatPhoneNumber(phone) {
  if (!phone) return '-'
  
  const cleaned = phone.replace(/\D/g, '')
  if (cleaned.length === 10) {
    return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(6)}`
  }
  return phone
}

export function getInitials(name) {
  if (!name) return '?'
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)
}