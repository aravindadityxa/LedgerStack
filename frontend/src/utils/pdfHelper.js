import api from '../services/api'

export async function downloadInvoicePdf(invoiceId, invoiceNumber) {
  try {
    const response = await api.get(`/invoices/${invoiceId}/pdf`, {
      responseType: 'blob',
    })
    
    const url = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `Invoice-${invoiceNumber}.pdf`)
    document.body.appendChild(link)
    link.click()
    
    setTimeout(() => {
      document.body.removeChild(link)
      window.URL.revokeObjectURL(url)
    }, 100)
    
    return true
  } catch (error) {
    console.error('PDF download failed:', error)
    throw error
  }
}

export function generateInvoiceHtml(invoice) {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; padding: 40px; }
        .header { display: flex; justify-content: space-between; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th { background: #f3f4f6; padding: 12px; text-align: left; }
        td { padding: 12px; border-bottom: 1px solid #e5e7eb; }
        .total { text-align: right; margin-top: 20px; }
      </style>
    </head>
    <body>
      <div class="header">
        <div>
          <h1>${invoice.user?.company_name || 'Company'}</h1>
        </div>
        <div>
          <h1>INVOICE #${invoice.invoice_number}</h1>
        </div>
      </div>
      <p>Date: ${new Date(invoice.issue_date).toLocaleDateString()}</p>
      <p>Due Date: ${new Date(invoice.due_date).toLocaleDateString()}</p>
      <table>
        <thead>
          <tr>
            <th>Description</th>
            <th>Qty</th>
            <th>Price</th>
            <th>Total</th>
          </tr>
        </thead>
        <tbody>
          ${invoice.items?.map(item => `
            <tr>
              <td>${item.description}</td>
              <td>${item.quantity}</td>
              <td>$${item.unit_price}</td>
              <td>$${item.total}</td>
            </tr>
          `).join('')}
        </tbody>
      </table>
      <div class="total">
        <h2>Total: $${invoice.total}</h2>
      </div>
    </body>
    </html>
  `
}