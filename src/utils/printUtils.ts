import type { BillingItem } from "../types/billing"
import { itemsData } from "../data/items"

// Function to dynamically import html2pdf
const loadHtml2Pdf = async () => {
  const html2pdf = await import("html2pdf.js")
  return html2pdf.default
}

// Function to ensure item names are in Marathi
const ensureMarathiItemName = (itemName: string): string => {
  if (!itemName || itemName.trim() === "") return itemName

  // First, try to find exact match
  const exactMatch = itemsData.find(
    (item) => item.english.toLowerCase() === itemName.toLowerCase() || item.marathi === itemName,
  )

  if (exactMatch) {
    console.log(`Converting "${itemName}" to "${exactMatch.marathi}"`)
    return exactMatch.marathi
  }

  // If no exact match, try partial match
  const partialMatch = itemsData.find(
    (item) =>
      item.english.toLowerCase().includes(itemName.toLowerCase()) ||
      itemName.toLowerCase().includes(item.english.toLowerCase()),
  )

  if (partialMatch) {
    console.log(`Partial match: Converting "${itemName}" to "${partialMatch.marathi}"`)
    return partialMatch.marathi
  }

  // If still no match, return original (might already be in Marathi)
  console.log(`No conversion found for "${itemName}", keeping original`)
  return itemName
}

export const generateAndDownloadPDF = async (
  items: BillingItem[],
  grandTotal: number,
  customerName: string,
  hastePerson = "",
): Promise<void> => {
  const validItems = items.filter((item) => item.name && item.total)

  console.log(
    "Items before conversion:",
    validItems.map((item) => item.name),
  )

  const itemsHTML = validItems
    .map((item, index) => {
      const marathiName = ensureMarathiItemName(item.name)
      console.log(`Item ${index + 1}: "${item.name}" -> "${marathiName}"`)

      return `
    <tr style="${index % 2 === 0 ? "background-color: white;" : "background-color: #f9fafb;"}">
      <td style="text-align: center; font-weight: 600; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;">${index + 1}</td>
      <td style="font-weight: 500; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 45%; text-align: left;">${marathiName}</td>
      <td style="text-align: center; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;">${item.quantity || "-"}</td>
      <td style="text-align: center; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 15%;">₹${item.price || "-"}</td>
      <td style="text-align: center; font-weight: bold; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 15%;">₹${Math.floor(Number.parseFloat(item.total) || 0)}</td>
      <td style="text-align: center; font-weight: bold; color: #dc2626; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;">₹${item.decimal || "00"}</td>
    </tr>
  `
    })
    .join("")

  // Add empty rows for consistent formatting
  const emptyRowsHTML = Array.from({ length: Math.max(0, 5 - validItems.length) })
    .map(
      (_, index) => `
    <tr>
      <td style="text-align: center; padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;">${validItems.length + index + 1}</td>
      <td style="padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 45%;"></td>
      <td style="padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;"></td>
      <td style="padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 15%;"></td>
      <td style="padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 15%;"></td>
      <td style="padding: 8px 4px; border: 1px solid #000; font-size: 12px; width: 10%;"></td>
    </tr>
  `,
    )
    .join("")

  const htmlContent = `
    <!DOCTYPE html>
    <html lang="hi">
    <head>
        <meta charset="UTF-8">
        <title>Narmada Traders - Bill</title>
        <link href="https://fonts.googleapis.com/css2?family=Noto+Sans+Devanagari:wght@400;600;700&display=swap" rel="stylesheet">
        <style>
            * {
                margin: 0;
                padding: 0;
                box-sizing: border-box;
            }
            
            body { 
                font-family: 'Noto Sans Devanagari', Arial, sans-serif; 
                color: #000;
                line-height: 1.3;
                font-size: 12px;
                background: white;
                width: 100%;
                max-width: 800px;
                margin: 0 auto;
                padding: 15px;
            }
            
            .main-container {
                width: 100%;
                max-width: 750px;
                margin: 0 auto;
                background: white;
            }
            
            .god-names-table {
                width: 100%;
                margin-bottom: 0px;
                border-collapse: collapse;
            }
            
            .god-names-table td {
                text-align: center;
                font-size: 14px;
                font-weight: bold;
                color: #374151;
                padding: 5px;
                width: 33.33%;
            }
            
            .print-header { 
                text-align: center; 
                border-bottom: 3px solid #000; 
                padding-bottom: 15px; 
                margin-bottom: 20px; 
                width: 100%;
            }
            
            .print-company-name { 
                font-size: 46px; 
                font-weight: bold; 
                margin-top: -10px;
                margin: 0 0 10px 0; 
                letter-spacing: 1px; 
                color: red;
            }
            
            .company-info {
                font-size: 13px;
                margin: 5px 0;
                font-weight: 500;
            }
            
            .bill-info-table {
                width: 100%;
                margin-bottom: 20px;
                border-collapse: collapse;
            }
            
            .bill-info-left {
                width: 60%;
                vertical-align: top;
                text-align: left;
                padding-right: 20px;
            }
            
            .bill-info-right {
                width: 40%;
                vertical-align: top;
                text-align: right;
            }
            
            .info-line {
                margin: 3px 0;
                font-size: 12px;
            }
            
            .customer-name {
                margin-bottom: 10px;
                margin-top: -10px;
                font-weight: bold;
                font-size: 20px;
            }
            
            .copy-label {
                font-weight: bold;
                font-size: 14px;
                margin-bottom: 8px;
            }
            
            .signature-container {
                border: 2px solid #000;
                width: 140px;
                height: 50px;
                margin: 5px 0 0 auto;
                position: relative;
                text-align: center;
            }
            
            .signature-label {
                font-weight: bold;
                font-size: 11px;
                margin: 3px 0;
            }
            
            .haste-name {
                font-weight: bold;
                color: #1e40af;
                font-size: 11px;
                position: absolute;
                bottom: 5px;
                left: 0;
                right: 0;
                text-align: center;
            }
            
            .print-table { 
                width: 100%; 
                border-collapse: collapse; 
                border: 2px solid #000; 
                margin-bottom: 20px; 
                table-layout: fixed;
            }
            
            .print-table th { 
                background-color: #2563eb; 
                color: white;
                font-weight: bold; 
                font-size: 12px;
                padding: 8px 4px;
                border: 1px solid #000;
                text-align: center;
            }
            
            .print-table td {
                border: 1px solid #000;
                padding: 8px 4px;
                font-size: 12px;
                vertical-align: middle;
            }
            
            .col-sr { width: 10%; }
            .col-item { width: 45%; }
            .col-qty { width: 10%; }
            .col-rate { width: 15%; }
            .col-amount { width: 15%; }
            .col-decimal { width: 10%; }
            
            .total-section { 
                text-align: right; 
                margin: 15px 0; 
                width: 100%;
            }
            
            .total-box {
                display: inline-block;
                background-color: #2563eb;
                color: white;
                padding: 12px 20px;
                border-radius: 5px;
                font-size: 16px;
                font-weight: bold;
            }
            
            .print-footer { 
                text-align: center; 
                border-top: 2px solid #000; 
                padding-top: 15px; 
                margin-top: 20px; 
                width: 100%;
            }
            
            .footer-title {
                font-weight: bold;
                font-size: 14px;
                color: #1e40af;
                margin-bottom: 8px;
            }
            
            .footer-text {
                margin: 5px 0;
                font-size: 11px;
            }
            
            .footer-subtitle {
                color: #666;
            }
            
            .footer-note {
                color: #666;
            }
            
            .footer-disclaimer {
                color: #999;
            }
        </style>
    </head>
    <body>
        <div class="main-container">
            <!-- Three God Names -->
            <table class="god-names-table">
                <tr>
                    <td>॥ श्री गणेशाय नमः ॥</td>
        
                </tr>
            </table>

            <!-- Company Header -->
            <div class="print-header">
            <h1 class="print-company-name">नर्मदा फर्निचर</h1>
            <p class="company-info">सोनई , जूनं त्रिमूर्ति थिएटर समोर , नर्मदा कॉम्प्लेक्स , ता. नेवासा , जि. अहिल्यानगर</p>
            <p class="company-info">प्रो.प्रा. सुनिल तागड - +91 9850732489 </p>
            <p class="company-info">भूषण तागड - +91 9850739289 </p>
            <p class="company-info">सोनई, महाराष्ट्र - 414105</p>
            </div>
            <!-- Bill Info and Customer Details -->
            <table class="bill-info-table">
                <tr>
                    <td class="bill-info-left">
                    <p class="customer-name">Shri. ${customerName}</p>
                        <p class="info-line"><strong>बिल नं:</strong> NT-${Date.now().toString().slice(-6)}</p>
                        <p class="info-line"><strong>दिनांक:</strong> ${new Date().toLocaleDateString("hi-IN")}</p>
                    </td>
                    
                </tr>
            </table>

            <!-- Items Table -->
            <table class="print-table">
                <thead>
                    <tr>
                        <th class="col-sr">अ.नं.</th>
                        <th class="col-item">तपशील</th>
                        <th class="col-qty">नग</th>
                        <th class="col-rate">दर</th>
                        <th class="col-amount">रुपये</th>
                        <th class="col-decimal">पैसे</th>
                    </tr>
                </thead>
                <tbody>
                    ${itemsHTML}
                    ${emptyRowsHTML}
                </tbody>
            </table>

            <!-- Total Section -->
            <div class="total-section">
                <div class="total-box">
                    एकूण रक्कम: ₹${grandTotal.toFixed(2)}
                </div>
            </div>

            <!-- Footer -->
            <div class="print-footer">
                <p class="footer-title">नर्मदा फर्निचर निवडल्याबद्दल धन्यवाद !!</p>
                <p class="footer-text footer-subtitle"></p>
                <p class="footer-text footer-note">एकदा विकलेला माल परत घेतला आणि बदलून दिला जाणार नाही.</p>
                <p class="footer-text footer-disclaimer">This is a computer generated bill.</p>
            </div>
        </div>
    </body>
    </html>
  `

  try {
    // Load html2pdf dynamically
    const html2pdf = await loadHtml2Pdf()

    // Create a temporary div element
    const element = document.createElement("div")
    element.innerHTML = htmlContent

    // Configure PDF options optimized for html2pdf.js
    const options = {
      margin: [5, 5, 5, 5],
      filename: `Narmada_Traders_Bill_${customerName.replace(/\s+/g, "_")}_${Date.now()}.pdf`,
      image: { type: "jpeg", quality: 0.95 },
      html2canvas: {
        scale: 1.5,
        useCORS: true,
        letterRendering: true,
        allowTaint: true,
        width: 800,
        height: 1100,
        scrollX: 0,
        scrollY: 0,
      },
      jsPDF: {
        unit: "mm",
        format: "a4",
        orientation: "portrait",
      },
    }

    // Generate and download PDF
    await html2pdf().set(options).from(element).save()

    // Show success message
    alert("PDF बिल successfully download झाले!")
  } catch (error) {
    console.error("PDF generation failed:", error)
    alert("PDF generate करताना error आली. कृपया पुन्हा try करा.")
  }
}

export const openPrintWindow = (htmlContent: string): void => {
  const printWindow = window.open("", "_blank")
  if (printWindow) {
    printWindow.document.write(htmlContent)
    printWindow.document.close()
    printWindow.focus()

    setTimeout(() => {
      printWindow.print()
    }, 500)
  }
}
