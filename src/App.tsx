"use client"

import { useState } from "react"
import Header from "./components/Header"
import BillingTable from "./components/BillingTable"
import ActionButtons from "./components/ActionButtons"
import PrintTemplate from "./components/PrintTemplate"
import type { BillingItem } from "./types/billing"
import { generateAndDownloadPDF } from "./utils/printUtils"

function App() {
  const [items, setItems] = useState<BillingItem[]>([])
  const [grandTotal, setGrandTotal] = useState(0)
  const [showGrandTotal, setShowGrandTotal] = useState(false)
  const [customerName, setCustomerName] = useState("")
  const [hastePerson, setHastePerson] = useState("")

  const handleGoBack = () => {
    if (confirm("Are you sure you want to go back? All unsaved data will be lost.")) {
      window.history.back()
    }
  }

  const calculateGrandTotal = () => {
    const total = items.reduce((sum, item) => {
      return sum + (Number.parseFloat(item.total) || 0)
    }, 0)

    setGrandTotal(total)
    setShowGrandTotal(total > 0)
  }

  const handleGeneratePDF = () => {
    if (items.length === 0 || grandTotal <= 0) {
      alert("कृपया आधी काही items जोडा आणि total calculate करा!")
      return
    }

    if (!customerName.trim()) {
      alert("कृपया customer name भरा!")
      return
    }

    generateAndDownloadPDF(items, grandTotal, customerName, hastePerson)
  }

  const handlePrint = () => {
    if (items.length === 0 || grandTotal <= 0) {
      alert("कृपया आधी काही items जोडा आणि total calculate करा!")
      return
    }

    if (!customerName.trim()) {
      alert("कृपया customer name भरा!")
      return
    }

    window.print()
  }

  const isDisabled = items.length === 0 || grandTotal <= 0 || !customerName.trim()

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
      <div className="max-w-7xl mx-auto">
        <Header
          onGoBack={handleGoBack}
          customerName={customerName}
          onCustomerNameChange={setCustomerName}
          hastePerson={hastePerson}
          onHastePersonChange={setHastePerson}
        />

        <BillingTable
          items={items}
          onUpdateItems={setItems}
          onCalculateTotal={calculateGrandTotal}
          grandTotal={grandTotal}
          showGrandTotal={showGrandTotal}
        />

        <ActionButtons onGeneratePDF={handleGeneratePDF} onPrint={handlePrint} disabled={isDisabled} />

        <PrintTemplate items={items} grandTotal={grandTotal} customerName={customerName} hastePerson={hastePerson} />
      </div>
    </div>
  )
}

export default App
