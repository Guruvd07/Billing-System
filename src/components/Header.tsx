"use client"

import type React from "react"
import { ArrowLeft } from "lucide-react"

interface HeaderProps {
  onGoBack: () => void
  customerName: string
  onCustomerNameChange: (name: string) => void
  hastePerson: string
  onHastePersonChange: (name: string) => void
}

const Header: React.FC<HeaderProps> = ({
  onGoBack,
  customerName,
  onCustomerNameChange,
  hastePerson,
  onHastePersonChange,
}) => {
  return (
    <div className="flex justify-between items-center mb-8 p-6 bg-white rounded-xl shadow-sm border border-gray-200">
      <button
        onClick={onGoBack}
        className="flex items-center gap-2 px-5 py-2.5 rounded-lg border-2 border-blue-500 text-blue-500 bg-white font-semibold hover:bg-blue-500 hover:text-white transition-all duration-200"
      >
        <ArrowLeft size={20} />
        <span>Welcome</span>
      </button>

      <div className="flex flex-col items-center">
        <h1 className="text-3xl font-bold text-gray-800 m-0">Billing System</h1>
        <div className="mt-4 flex items-center gap-6">
          <div className="flex items-center gap-3">
            <label className="text-sm font-semibold text-gray-700">Customer Name:</label>
            <input
              type="text"
              value={customerName}
              onChange={(e) => onCustomerNameChange(e.target.value)}
              placeholder="Enter customer name..."
              className="px-4 py-2 border-2 border-gray-300 rounded-lg text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200 min-w-48"
            />
          </div>
          
        </div>
      </div>

      <div className="text-right">
        <h2 className="text-xl font-semibold text-gray-800 m-0">Narmada Traders</h2>
        <p className="text-sm text-gray-600 m-0">Owner: Sunil Tagad</p>
      </div>
    </div>
  )
}

export default Header
