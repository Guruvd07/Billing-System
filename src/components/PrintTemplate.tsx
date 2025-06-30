import type React from "react"
import type { BillingItem } from "../types/billing"

interface PrintTemplateProps {
  items: BillingItem[]
  grandTotal: number
  customerName: string
  hastePerson: string
}

const PrintTemplate: React.FC<PrintTemplateProps> = ({ items, grandTotal, customerName, hastePerson }) => {
  const validItems = items.filter((item) => item.name && item.total)

  return (
    <div className="hidden print:block max-w-4xl mx-auto bg-white p-10 font-sans text-sm leading-relaxed text-black">
      {/* Three God Names at Top */}
      <div className="flex justify-between items-center mb-6 text-lg font-bold text-gray-800">
        <div className="text-center">
          <p className="mb-0">॥ श्री गणेशाय नमः ॥</p>
        </div>
      </div>

      {/* Company Header */}
      <div className="text-center border-b-4 border-black pb-6 mb-8">
        <h1 className="text-4xl font-bold mb-3 tracking-wider text-blue-800">नर्मदा ट्रेडर्स</h1>
        <p className="text-lg mb-2">सोनई , जूनं त्रिमूर्ति थिएटर समोर , नर्मदा कॉम्प्लेक्स , ता. नेवासा , जि. अहिल्यानगर</p>
        <p className="mb-1 font-semibold">प्रो.प्रा. सुनिल तागड - +91 9850732489 </p>
        <p className="mb-1 font-semibold">भूषण तागड - +91 9850739289  </p>

        <p className="mb-0 font-semibold">सोनई, महाराष्ट्र - 414105</p>
      </div>

      {/* Bill Info and Customer Details */}
      <div className="flex justify-between items-start mb-6">
        <div>
          <p className="mb-1">
            <strong>Bill No:</strong> NT-{Date.now().toString().slice(-6)}
          </p>
          <p className="mb-1">
            <strong>Date:</strong> {new Date().toLocaleDateString("hi-IN")}
          </p>
          <p className="mb-3">
            <strong>Time:</strong> {new Date().toLocaleTimeString("hi-IN")}
          </p>
          <p className="mb-0 font-semibold text-lg">ग्राहक: {customerName}</p>
        </div>
        <div className="text-right">
          <p className="mb-0 font-bold text-lg">Customer Copy</p>
        </div>
      </div>

      {/* Items Table */}
      <table className="w-full border-collapse border-2 border-black mb-6">
        <thead>
          <tr className="bg-blue-600 text-white">
            <th className="border border-black p-3 font-bold">अ.नं.</th>
            <th className="border border-black p-3 font-bold">तपशील</th>
            <th className="border border-black p-3 font-bold">नग</th>
            <th className="border border-black p-3 font-bold">दर</th>
            <th className="border border-black p-3 font-bold">रुपये</th>
            <th className="border border-black p-3 font-bold">पैसे</th>
          </tr>
        </thead>
        <tbody>
          {validItems.map((item, index) => (
            <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              <td className="border border-black p-3 text-center font-semibold">{index + 1}</td>
              <td className="border border-black p-3 font-medium">{item.name}</td>
              <td className="border border-black p-3 text-center">{item.quantity || "-"}</td>
              <td className="border border-black p-3 text-center">₹{item.price || "-"}</td>
              <td className="border border-black p-3 text-center font-bold">
                ₹{Math.floor(Number.parseFloat(item.total) || 0)}
              </td>
              <td className="border border-black p-3 text-center font-bold text-red-600">₹{item.decimal || "00"}</td>
            </tr>
          ))}
          {/* Empty rows for spacing */}
          {Array.from({ length: Math.max(0, 5 - validItems.length) }).map((_, index) => (
            <tr key={`empty-${index}`}>
              <td className="border border-black p-3 text-center">{validItems.length + index + 1}</td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
              <td className="border border-black p-3"></td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Total Section */}
      <div className="text-right mb-8">
        <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-lg">
          <p className="text-2xl font-bold mb-0">एकूण रक्कम: ₹{grandTotal.toFixed(2)}</p>
        </div>
      </div>

      {/* Footer */}
      <div className="text-center border-t-2 border-black pt-6 mt-10">
        <p className="font-bold text-lg mb-1 text-blue-800">नर्मदा ट्रेडर्स निवडल्याबद्दल धन्यवाद!</p>
        <p className="mb-0 text-gray-600">दर्जेदार फर्निचर आणि उपकरणासाठी पुन्हा भेट द्या</p>
        <p className="mt-4 mb-0 text-sm text-gray-500">टिप : एकदा विकलेला माल परत घेतला आणि बदलून दिला जाणार नाही.</p>
        <p className="mt-2 mb-0 text-xs text-gray-400">This is a computer generated bill.</p>
      </div>
    </div>
  )
}

export default PrintTemplate
