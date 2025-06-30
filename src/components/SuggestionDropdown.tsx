"use client"

import type React from "react"
import type { ItemData } from "../types/billing"

interface SuggestionDropdownProps {
  suggestions: ItemData[]
  activeSuggestionIndex: number
  onSelect: (index: number) => void
  position: { top: number; left: number }
  visible: boolean
}

const SuggestionDropdown: React.FC<SuggestionDropdownProps> = ({
  suggestions,
  activeSuggestionIndex,
  onSelect,
  position,
  visible,
}) => {
  if (!visible || suggestions.length === 0) {
    return null
  }

  return (
    <div
      className="fixed z-50 bg-white border-2 border-blue-500 rounded-lg shadow-2xl max-h-64 overflow-y-auto min-w-80 max-w-96 suggestion-dropdown"
      style={{ top: position.top, left: position.left }}
    >
      {suggestions.map((item, index) => (
        <div
          key={index}
          className={`p-4 cursor-pointer border-b border-gray-100 last:border-b-0 hover:bg-blue-50 transition-colors duration-200 ${
            index === activeSuggestionIndex ? "bg-blue-100 border-blue-300" : ""
          }`}
          onClick={() => onSelect(index)}
        >
          <div className="text-xs text-gray-500 mb-1">{item.english}</div>
          <div className="text-lg font-bold text-blue-600">{item.marathi}</div>
          <div className="text-xs text-green-600 mt-1">← This will appear in PDF</div>
        </div>
      ))}
    </div>
  )
}

export default SuggestionDropdown
