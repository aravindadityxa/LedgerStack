from reportlab.lib.pagesizes import letter
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.lib.units import inch
from reportlab.platypus import SimpleDocTemplate, Table, TableStyle, Paragraph, Spacer, Image
from reportlab.lib.enums import TA_LEFT, TA_RIGHT, TA_CENTER
import os
from datetime import datetime

def generate_invoice_pdf(invoice, user):
    pdf_dir = "generated_pdfs"
    os.makedirs(pdf_dir, exist_ok=True)
    
    filename = f"{pdf_dir}/invoice_{invoice.invoice_number}.pdf"
    doc = SimpleDocTemplate(filename, pagesize=letter)
    story = []
    styles = getSampleStyleSheet()
    
    # Custom styles
    title_style = ParagraphStyle('CustomTitle', parent=styles['Heading1'], fontSize=24, spaceAfter=30)
    header_style = ParagraphStyle('Header', parent=styles['Normal'], fontSize=10, textColor=colors.gray)
    normal_style = styles['Normal']
    
    # Header
    header_data = [
        [
            Paragraph(f"<b>{user.company_name or user.full_name}</b>", title_style),
            Paragraph(f"<b>INVOICE</b><br/>#{invoice.invoice_number}", ParagraphStyle('RightAlign', parent=title_style, alignment=TA_RIGHT))
        ]
    ]
    header_table = Table(header_data, colWidths=[3.5*inch, 3.5*inch])
    header_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, 0), 'LEFT'),
        ('ALIGN', (1, 0), (1, 0), 'RIGHT'),
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
    ]))
    story.append(header_table)
    story.append(Spacer(1, 20))
    
    # Company & Customer Info
    info_data = [
        [
            Paragraph(f"<b>From:</b><br/>{user.full_name}<br/>{user.email}<br/>{user.address or ''}", normal_style),
            Paragraph(f"<b>To:</b><br/>{invoice.customer.name}<br/>{invoice.customer.company_name or ''}<br/>{invoice.customer.email or ''}", normal_style)
        ]
    ]
    info_table = Table(info_data, colWidths=[3.5*inch, 3.5*inch])
    story.append(info_table)
    story.append(Spacer(1, 20))
    
    # Invoice Details
    details_data = [
        [Paragraph("<b>Issue Date:</b>", normal_style), Paragraph(invoice.issue_date.strftime("%B %d, %Y"), normal_style)],
        [Paragraph("<b>Due Date:</b>", normal_style), Paragraph(invoice.due_date.strftime("%B %d, %Y"), normal_style)],
        [Paragraph("<b>Status:</b>", normal_style), Paragraph(invoice.status.value.upper(), normal_style)],
    ]
    details_table = Table(details_data, colWidths=[1.5*inch, 2*inch])
    details_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (1, -1), 'LEFT'),
        ('TOPPADDING', (0, 0), (-1, -1), 2),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 2),
    ]))
    story.append(details_table)
    story.append(Spacer(1, 30))
    
    # Items Table
    items_header = ['Description', 'Qty', 'Unit Price', 'Total']
    items_data = [items_header]
    
    for item in invoice.items:
        items_data.append([
            item.description,
            str(item.quantity),
            f"${item.unit_price:,.2f}",
            f"${item.total:,.2f}"
        ])
    
    items_table = Table(items_data, colWidths=[3.5*inch, 0.75*inch, 1.25*inch, 1.5*inch])
    items_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#F3F4F6')),
        ('TEXTCOLOR', (0, 0), (-1, 0), colors.black),
        ('ALIGN', (0, 0), (0, -1), 'LEFT'),
        ('ALIGN', (1, 0), (-1, -1), 'RIGHT'),
        ('FONTNAME', (0, 0), (-1, 0), 'Helvetica-Bold'),
        ('FONTSIZE', (0, 0), (-1, 0), 10),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 12),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E5E7EB')),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F9FAFB')]),
    ]))
    story.append(items_table)
    story.append(Spacer(1, 20))
    
    # Totals
    totals_data = [
        ['', 'Subtotal:', f"${invoice.subtotal:,.2f}"],
        ['', f'Tax ({invoice.tax_rate}%):', f"${invoice.tax_amount:,.2f}"],
        ['', 'Total:', f"${invoice.total:,.2f}"],
        ['', 'Amount Paid:', f"${invoice.amount_paid:,.2f}"],
        ['', 'Balance Due:', f"${invoice.balance_due:,.2f}"],
    ]
    
    totals_table = Table(totals_data, colWidths=[4.5*inch, 1.25*inch, 1.25*inch])
    totals_table.setStyle(TableStyle([
        ('ALIGN', (0, 0), (1, -1), 'RIGHT'),
        ('ALIGN', (2, 0), (2, -1), 'RIGHT'),
        ('FONTNAME', (0, -1), (-1, -1), 'Helvetica-Bold'),
        ('LINEABOVE', (0, 2), (-1, 2), 1, colors.black),
    ]))
    story.append(totals_table)
    
    # Notes
    if invoice.notes:
        story.append(Spacer(1, 30))
        story.append(Paragraph("<b>Notes:</b>", normal_style))
        story.append(Paragraph(invoice.notes, normal_style))
    
    doc.build(story)
    return filename