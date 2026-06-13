import { format, parseISO, startOfMonth, endOfMonth, subMonths, isAfter, isBefore, differenceInDays } from 'date-fns'

export function getMonthRange(monthsBack = 0) {
  const date = subMonths(new Date(), monthsBack)
  return {
    start: startOfMonth(date),
    end: endOfMonth(date),
  }
}

export function getLastSixMonths() {
  return Array.from({ length: 6 }, (_, i) => {
    const date = subMonths(new Date(), i)
    return {
      month: format(date, 'MMM yyyy'),
      start: startOfMonth(date),
      end: endOfMonth(date),
    }
  }).reverse()
}

export function isOverdue(dueDate) {
  if (!dueDate) return false
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return isBefore(due, new Date())
}

export function getDaysUntilDue(dueDate) {
  if (!dueDate) return 0
  const due = typeof dueDate === 'string' ? parseISO(dueDate) : dueDate
  return differenceInDays(due, new Date())
}

export function formatDateRange(startDate, endDate) {
  const start = format(parseISO(startDate), 'MMM dd, yyyy')
  const end = format(parseISO(endDate), 'MMM dd, yyyy')
  return `${start} - ${end}`
}

export function getCurrentFiscalYear() {
  const today = new Date()
  const year = today.getMonth() >= 3 ? today.getFullYear() : today.getFullYear() - 1
  return {
    start: new Date(year, 3, 1),
    end: new Date(year + 1, 2, 31),
    label: `FY ${year}-${(year + 1).toString().slice(2)}`,
  }
}