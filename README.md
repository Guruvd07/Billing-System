# 🏪 Narmada Traders - Billing System

A modern, bilingual (English/Marathi) billing system built specifically for **Narmada Traders**, a furniture and equipment store in Sonai, Maharashtra. This system generates professional PDF bills with perfect Marathi font rendering and automatic item name conversion.
Live Demo - https://billing-system-lime.vercel.app/

## 🌟 Features

### 📋 **Billing Management**
- **Smart Item Entry**: Auto-complete suggestions with English-to-Marathi conversion
- **Real-time Calculations**: Automatic total calculation with decimal separation
- **Dynamic Row Management**: Auto-add new rows when completing entries
- **Manual Total Override**: Option to manually enter totals when needed

### 🎯 **Marathi Support**
- **Perfect Marathi Fonts**: Uses Noto Sans Devanagari for authentic rendering
- **Auto-conversion**: English item names automatically convert to Marathi in PDF
- **Bilingual Interface**: English interface with Marathi output
- **Cultural Elements**: Traditional god names (गणेशाय नमः, सरस्वत्यै नमः, लक्ष्म्यै नमः)

### 📄 **PDF Generation**
- **Professional Layout**: Clean, business-ready PDF format
- **Single Page Design**: Optimized to fit everything on one A4 page
- **Signature Section**: Dedicated space for customer signature (हस्ते)
- **Company Branding**: Complete business information and contact details

### 🛠 **User Experience**
- **Keyboard Navigation**: Press Enter to move between fields
- **Smart Suggestions**: Type in English, get Marathi suggestions
- **Visual Feedback**: Color-coded inputs and status indicators
- **Error Prevention**: Validation before PDF generation

## 🏗 **Tech Stack**

- **Frontend**: React 18 + TypeScript
- **Styling**: Tailwind CSS
- **PDF Generation**: html2pdf.js
- **Icons**: Lucide React
- **Fonts**: Google Fonts (Noto Sans Devanagari)
- **Build Tool**: Vite

## 🚀 **Getting Started**

### Prerequisites
- Node.js 16+ 
- npm or yarn

### Installation

1. **Clone the repository**
   \`\`\`bash
   git clone https://github.com/your-username/narmada-traders-billing.git
   cd narmada-traders-billing
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   \`\`\`

3. **Start development server**
   \`\`\`bash
   npm run dev
   \`\`\`

4. **Open in browser**
   Navigate to \`http://localhost:5173\`

## 📖 **How to Use**

### Creating a Bill

1. **Enter Customer Details**
   - Fill in customer name (required)
   - Add signature person name (हस्ते) if needed

2. **Add Items**
   - Start typing item name in English
   - Select from Marathi suggestions dropdown
   - Enter quantity and price
   - Press Enter to move to next field

3. **Calculate Total**
   - Click "Calculate Total" button
   - Review the grand total

4. **Generate PDF**
   - Click "Generate PDF (Perfect Marathi)"
   - PDF will open in new window
   - Select "Save as PDF" from print dialog

### Keyboard Shortcuts
- **Enter**: Move to next field
- **Arrow Keys**: Navigate suggestions
- **Escape**: Close suggestions


## 🎨 **Customization**

### Adding New Items
Edit \`src/data/items.ts\` to add new items:

\`\`\`typescript
{ english: "New Item", marathi: "नवीन वस्तू" }
\`\`\`

### Modifying Company Info
Update company details in \`src/utils/printUtils.ts\`:

\`\`\`typescript
<h1 class="print-company-name">Your Company Name</h1>
<p class="company-info">Your Address</p>
\`\`\`

### Styling Changes
Modify Tailwind classes in component files or update \`src/index.css\`

## 🔧 **Configuration**

### PDF Settings
Adjust PDF generation options in \`src/utils/printUtils.ts\`:

\`\`\`typescript
const options = {
  margin: [5, 5, 5, 5],
  image: { type: "jpeg", quality: 0.95 },
  html2canvas: { scale: 1.5 },
  jsPDF: { format: "a4", orientation: "portrait" }
}
\`\`\`

## 📱 **Browser Support**

- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 🐛 **Troubleshooting**

### PDF Not Generating
- Check if pop-ups are blocked
- Ensure html2pdf.js is loaded properly
- Verify all required fields are filled

### Marathi Text Not Showing
- Ensure items are selected from dropdown suggestions
- Check browser console for conversion logs
- Verify Noto Sans Devanagari font is loading

### Layout Issues
- Clear browser cache
- Check CSS conflicts
- Verify Tailwind CSS is loading

## 🤝 **Contributing**

1. Fork the repository
2. Create feature branch (\`git checkout -b feature/amazing-feature\`)
3. Commit changes (\`git commit -m 'Add amazing feature'\`)
4. Push to branch (\`git push origin feature/amazing-feature\`)
5. Open Pull Request

## 📄 **License**

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 👨‍💼 **About Narmada Traders**

**नर्मदा ट्रेडर्स** is a furniture and equipment store located in:
- **Address**: सोनई, त्रिमूर्ति थिएटर समोर, ता. नेवासा, जि. अहिल्यानगर
- **Phone**: +91 9850732489 / +91 87654-32109
- **Location**: सोनई, महाराष्ट्र - 414105
- **Owner**: Sunil Tagad

Specializing in quality furniture and equipment with traditional values and modern service.

## 🙏 **Acknowledgments**

- Google Fonts for Noto Sans Devanagari
- html2pdf.js for PDF generation
- Tailwind CSS for styling
- Lucide React for icons
- The React community for excellent documentation

## 📞 **Support**

For technical support or business inquiries:
- **Email**: support@narmadatraders.com
- **Phone**: +91 9850732489
- **GitHub Issues**: [Create an issue](https://github.com/your-username/narmada-traders-billing/issues)

---

**Made with ❤️ for Narmada Traders**

*"दर्जेदार फर्निचर आणि उपकरणासाठी पुन्हा भेट द्या"*
\`\`\`
