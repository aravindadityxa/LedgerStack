export const INVOICE_STATUS = {
  DRAFT: 'draft',
  PENDING: 'pending',
  PAID: 'paid',
  OVERDUE: 'overdue',
  CANCELLED: 'cancelled',
}

export const PAYMENT_METHODS = [
  { value: 'credit_card', label: 'Credit Card' },
  { value: 'bank_transfer', label: 'Bank Transfer' },
  { value: 'paypal', label: 'PayPal' },
  { value: 'cash', label: 'Cash' },
  { value: 'other', label: 'Other' },
]

export const TAX_RATES = [
  { value: 0, label: '0%' },
  { value: 5, label: '5%' },
  { value: 10, label: '10%' },
  { value: 15, label: '15%' },
  { value: 20, label: '20%' },
]

export const ITEMS_PER_PAGE_OPTIONS = [5, 10, 20, 50]

export const DATE_FORMAT = 'MMM dd, yyyy'
export const CURRENCY = 'USD'
export const CURRENCY_SYMBOL = '$'