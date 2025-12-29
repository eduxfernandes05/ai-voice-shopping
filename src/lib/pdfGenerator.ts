import { jsPDF } from 'jspdf'

interface ServiceDetail {
  id: string
  label: string
  price: number
  description: string
}

export function generateQuotePDF(
  services: ServiceDetail[],
  subtotal: number,
  tax: number,
  total: number
) {
  const doc = new jsPDF()
  
  // Header with gradient effect (simulated with rectangles)
  doc.setFillColor(147, 51, 234) // Purple
  doc.rect(0, 0, 210, 40, 'F')
  
  // Company name
  doc.setTextColor(255, 255, 255)
  doc.setFontSize(28)
  doc.setFont('helvetica', 'bold')
  doc.text('Nexus Platform', 20, 20)
  
  doc.setFontSize(12)
  doc.setFont('helvetica', 'normal')
  doc.text('Professional Services Portal', 20, 28)
  
  // Quote info
  doc.setTextColor(0, 0, 0)
  doc.setFontSize(10)
  doc.text(`Quote Date: ${new Date().toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  })}`, 20, 50)
  doc.text(`Quote ID: NX${Date.now().toString().slice(-8)}`, 20, 56)
  
  // Section: Selected Services
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(147, 51, 234)
  doc.text('Selected Services', 20, 70)
  
  // Services table header
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.setTextColor(0, 0, 0)
  let yPos = 80
  
  doc.setFillColor(240, 240, 245)
  doc.rect(20, yPos - 5, 170, 8, 'F')
  doc.text('Service', 25, yPos)
  doc.text('Price/Month', 160, yPos, { align: 'right' })
  
  // Services list
  doc.setFont('helvetica', 'normal')
  yPos += 10
  
  services.forEach((service, index) => {
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }
    
    // Alternate row colors
    if (index % 2 === 0) {
      doc.setFillColor(250, 250, 252)
      doc.rect(20, yPos - 5, 170, 10, 'F')
    }
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(service.label, 25, yPos)
    
    doc.setFont('helvetica', 'normal')
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text(service.description, 25, yPos + 4)
    
    doc.setTextColor(0, 0, 0)
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(`$${service.price.toFixed(2)}`, 160, yPos, { align: 'right' })
    
    yPos += 12
  })
  
  // Summary section
  yPos += 10
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, 190, yPos)
  yPos += 10
  
  doc.setFont('helvetica', 'normal')
  doc.setFontSize(10)
  doc.text('Subtotal:', 120, yPos)
  doc.text(`$${subtotal.toFixed(2)}`, 160, yPos, { align: 'right' })
  
  yPos += 7
  doc.text('Tax (10%):', 120, yPos)
  doc.text(`$${tax.toFixed(2)}`, 160, yPos, { align: 'right' })
  
  yPos += 10
  doc.setDrawColor(147, 51, 234)
  doc.setLineWidth(0.5)
  doc.line(120, yPos - 3, 190, yPos - 3)
  
  yPos += 7
  doc.setFont('helvetica', 'bold')
  doc.setFontSize(12)
  doc.setTextColor(147, 51, 234)
  doc.text('Total Monthly Cost:', 120, yPos)
  doc.setFontSize(14)
  doc.setTextColor(0, 0, 0)
  doc.text(`$${total.toFixed(2)}`, 190, yPos, { align: 'right' })
  
  // What's Included section
  yPos += 20
  doc.setFontSize(14)
  doc.text('What\'s Included', 20, yPos)
  
  yPos += 10
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.setTextColor(0, 0, 0)
  
  const included = [
    '✓ 30-day money-back guarantee',
    '✓ Dedicated account manager',
    '✓ Priority support',
    '✓ Flexible payment options'
  ]
  
  included.forEach(item => {
    doc.text(item, 25, yPos)
    yPos += 6
  })
  
  // Footer
  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.setFontSize(8)
    doc.setTextColor(150, 150, 150)
    doc.text(
      'This quote is valid for 30 days from the date of issue.',
      105,
      280,
      { align: 'center' }
    )
    doc.text(
      `Page ${i} of ${pageCount}`,
      105,
      285,
      { align: 'center' }
    )
  }
  
  // Save the PDF
  doc.save(`Nexus-Platform-Quote-${Date.now().toString().slice(-8)}.pdf`)
}
