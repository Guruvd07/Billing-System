"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"
import { Plus, Calculator, Trash2 } from "lucide-react"
import type { BillingItem, ItemData } from "../types/billing"
import { itemsData } from "../data/items"
import SuggestionDropdown from "./SuggestionDropdown"

interface BillingTableProps {
  items: BillingItem[]
  onUpdateItems: (items: BillingItem[]) => void
  onCalculateTotal: () => void
  grandTotal: number
  showGrandTotal: boolean
}

const BillingTable: React.FC<BillingTableProps> = ({
  items,
  onUpdateItems,
  onCalculateTotal,
  grandTotal,
  showGrandTotal,
}) => {
  const [suggestions, setSuggestions] = useState<ItemData[]>([])
  const [activeSuggestionIndex, setActiveSuggestionIndex] = useState(-1)
  const [suggestionPosition, setSuggestionPosition] = useState({ top: 0, left: 0 })
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [currentInputId, setCurrentInputId] = useState<number | null>(null)
  const [nextId, setNextId] = useState(1)

  const inputRefs = useRef<{ [key: string]: HTMLInputElement }>({})

  useEffect(() => {
    if (items.length === 0) {
      addNewRow()
    }
  }, [])

  const addNewRow = () => {
    const newItem: BillingItem = {
      id: nextId,
      name: "",
      quantity: "",
      price: "",
      total: "",
      decimal: "",
      isManualTotal: false,
    }
    onUpdateItems([...items, newItem])
    setNextId(nextId + 1)

    // Focus on the new row's name input after a short delay
    setTimeout(() => {
      const nameInput = inputRefs.current[`name-${nextId}`]
      if (nameInput) {
        nameInput.focus()
      }
    }, 100)
  }

  const removeRow = (id: number) => {
    if (items.length <= 1) {
      // Don't remove the last row, just clear it
      const clearedItems = items.map((item) =>
        item.id === id
          ? { ...item, name: "", quantity: "", price: "", total: "", decimal: "", isManualTotal: false }
          : item,
      )
      onUpdateItems(clearedItems)
    } else {
      const filteredItems = items.filter((item) => item.id !== id)
      onUpdateItems(filteredItems)
    }
    onCalculateTotal()
  }

  const updateItem = (id: number, field: keyof BillingItem, value: string | boolean) => {
    const updatedItems = items.map((item) => {
      if (item.id === id) {
        const updatedItem = { ...item, [field]: value }

        // Auto-calculate total if quantity or price changes (and not manual total)
        if ((field === "quantity" || field === "price") && !updatedItem.isManualTotal) {
          const qty = Number.parseFloat(updatedItem.quantity) || 0
          const price = Number.parseFloat(updatedItem.price) || 0
          const total = qty * price
          updatedItem.total = total > 0 ? total.toFixed(2) : ""
          updatedItem.decimal = total > 0 ? ((total % 1) * 100).toFixed(0).padStart(2, "0") : ""
        }

        // Calculate decimal when total is manually entered
        if (field === "total") {
          updatedItem.isManualTotal = true
          const total = Number.parseFloat(value as string) || 0
          updatedItem.decimal = total > 0 ? ((total % 1) * 100).toFixed(0).padStart(2, "0") : ""
        }

        return updatedItem
      }
      return item
    })
    onUpdateItems(updatedItems)
  }

  const focusNextField = (currentId: number, currentField: string) => {
    const currentItem = items.find((item) => item.id === currentId)
    if (!currentItem) return

    let nextFieldKey = ""

    switch (currentField) {
      case "name":
        if (currentItem.name.trim()) {
          nextFieldKey = `quantity-${currentId}`
        }
        break
      case "quantity":
        if (currentItem.quantity.trim()) {
          nextFieldKey = `price-${currentId}`
        }
        break
      case "price":
        if (currentItem.price.trim()) {
          // Auto-calculate total and move to next row
          setTimeout(() => {
            // Check if this is the last row or if current row is complete
            const isLastRow = items[items.length - 1].id === currentId
            const isCurrentRowComplete = currentItem.name && currentItem.quantity && currentItem.price

            if (isLastRow && isCurrentRowComplete) {
              addNewRow()
            } else if (!isLastRow) {
              // Focus on next row's name field
              const nextRowIndex = items.findIndex((item) => item.id === currentId) + 1
              if (nextRowIndex < items.length) {
                const nextRowId = items[nextRowIndex].id
                nextFieldKey = `name-${nextRowId}`
              }
            }

            if (nextFieldKey) {
              const nextInput = inputRefs.current[nextFieldKey]
              if (nextInput) {
                nextInput.focus()
              }
            }
          }, 100)
        }
        break
    }

    if (nextFieldKey && currentField !== "price") {
      setTimeout(() => {
        const nextInput = inputRefs.current[nextFieldKey]
        if (nextInput) {
          nextInput.focus()
        }
      }, 50)
    }
  }

  const handleNameInput = (id: number, value: string, inputElement: HTMLInputElement) => {
    updateItem(id, "name", value)

    if (value.length === 0) {
      setShowSuggestions(false)
      return
    }

    const filteredSuggestions = itemsData
      .filter((item) => item.marathi.includes(value) || item.english.toLowerCase().includes(value.toLowerCase()))
      .slice(0, 8)

    if (filteredSuggestions.length === 0) {
      setShowSuggestions(false)
      return
    }

    const rect = inputElement.getBoundingClientRect()
    setSuggestionPosition({
      top: rect.bottom + 5,
      left: rect.left,
    })

    setSuggestions(filteredSuggestions)
    setActiveSuggestionIndex(-1)
    setCurrentInputId(id)
    setShowSuggestions(true)
  }

  const handleKeyDown = (event: React.KeyboardEvent, id: number, field: string) => {
    if (showSuggestions && currentInputId === id) {
      switch (event.key) {
        case "ArrowDown":
          event.preventDefault()
          setActiveSuggestionIndex(Math.min(activeSuggestionIndex + 1, suggestions.length - 1))
          break
        case "ArrowUp":
          event.preventDefault()
          setActiveSuggestionIndex(Math.max(activeSuggestionIndex - 1, -1))
          break
        case "Enter":
          event.preventDefault()
          if (activeSuggestionIndex >= 0) {
            selectSuggestion(activeSuggestionIndex)
          } else {
            setShowSuggestions(false)
            focusNextField(id, field)
          }
          break
        case "Escape":
          setShowSuggestions(false)
          break
      }
    } else if (event.key === "Enter") {
      event.preventDefault()
      focusNextField(id, field)
    }
  }

  const selectSuggestion = (index: number) => {
    if (index >= 0 && index < suggestions.length && currentInputId !== null) {
      const selectedItem = suggestions[index]
      // Store the Marathi text instead of English
      updateItem(currentInputId, "name", selectedItem.marathi)
      setShowSuggestions(false)
      focusNextField(currentInputId, "name")
    }
  }

  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement
    if (!target.closest(".suggestion-dropdown") && !target.closest('input[type="text"]')) {
      setShowSuggestions(false)
    }
  }

  useEffect(() => {
    document.addEventListener("click", handleClickOutside)
    return () => document.removeEventListener("click", handleClickOutside)
  }, [])

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 mb-8">
      <div className="bg-gray-800 text-white rounded-t-xl px-8 py-5">
        <h2 className="text-xl font-semibold m-0">Bill Items</h2>
        <p className="text-sm text-gray-300 mt-1 mb-0">
          Press Enter to move to next field • Auto-creates new row when complete
        </p>
      </div>

      <div className="overflow-x-auto">
        <table className="w-full border-collapse">
          <thead>
            <tr className="bg-gray-50">
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-20 border-b-2 border-gray-200">
                Sr. No.
              </th>
              <th className="px-6 py-4 text-left font-semibold text-gray-700 text-sm min-w-80 border-b-2 border-gray-200">
                Item Name
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-32 border-b-2 border-gray-200">
                Quantity
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-36 border-b-2 border-gray-200">
                Price per Item
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-36 border-b-2 border-gray-200">
                Total (₹)
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-32 border-b-2 border-gray-200">
                Decimal
              </th>
              <th className="px-6 py-4 text-center font-semibold text-gray-700 text-sm w-20 border-b-2 border-gray-200">
                Action
              </th>
            </tr>
          </thead>
          <tbody>
            {items.map((item, index) => (
              <tr key={item.id} className={index % 2 === 0 ? "bg-white" : "bg-gray-50"}>
                <td className="px-6 py-4 text-center font-semibold text-blue-600 text-lg border-b border-white">
                  {index + 1}
                </td>
                <td className="px-6 py-4 border-b border-white">
                  <input
                    ref={(el) => el && (inputRefs.current[`name-${item.id}`] = el)}
                    type="text"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-blue-500 focus:ring-2 focus:ring-blue-200 transition-all duration-200"
                    value={item.name}
                    placeholder="Enter item name and press Enter..."
                    onChange={(e) => handleNameInput(item.id, e.target.value, e.target)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, "name")}
                  />
                </td>
                <td className="px-6 py-4 border-b border-white">
                  <input
                    ref={(el) => el && (inputRefs.current[`quantity-${item.id}`] = el)}
                    type="number"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-green-500 focus:ring-2 focus:ring-green-200 transition-all duration-200"
                    value={item.quantity}
                    placeholder="Qty"
                    step="0.01"
                    min="0"
                    onChange={(e) => updateItem(item.id, "quantity", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, "quantity")}
                  />
                </td>
                <td className="px-6 py-4 border-b border-white">
                  <input
                    ref={(el) => el && (inputRefs.current[`price-${item.id}`] = el)}
                    type="number"
                    className="w-full px-3 py-2.5 border-2 border-gray-300 rounded-md text-sm focus:outline-none focus:border-yellow-500 focus:ring-2 focus:ring-yellow-200 transition-all duration-200"
                    value={item.price}
                    placeholder="Price"
                    step="0.01"
                    min="0"
                    onChange={(e) => updateItem(item.id, "price", e.target.value)}
                    onKeyDown={(e) => handleKeyDown(e, item.id, "price")}
                  />
                </td>
                <td className="px-6 py-4 border-b border-white">
                  <input
                    type="number"
                    className={`w-full px-3 py-2.5 border-2 rounded-md text-sm font-bold text-right focus:outline-none transition-all duration-200 ${
                      item.isManualTotal
                        ? "border-yellow-500 bg-yellow-50 text-yellow-800 focus:ring-2 focus:ring-yellow-200"
                        : "border-green-500 bg-green-50 text-green-800 focus:ring-2 focus:ring-green-200"
                    }`}
                    value={item.total}
                    placeholder="Total"
                    step="0.01"
                    min="0"
                    onChange={(e) => updateItem(item.id, "total", e.target.value)}
                    readOnly={!item.isManualTotal}
                  />
                </td>
                <td className="px-6 py-4 text-center font-bold text-lg text-red-600 bg-red-50 border-b border-white">
                  {item.decimal}
                </td>
                <td className="px-6 py-4 text-center border-b border-white">
                  <button
                    className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors duration-200"
                    onClick={() => removeRow(item.id)}
                  >
                    <Trash2 size={16} />
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      <SuggestionDropdown
        suggestions={suggestions}
        activeSuggestionIndex={activeSuggestionIndex}
        onSelect={selectSuggestion}
        position={suggestionPosition}
        visible={showSuggestions}
      />

      <div className="flex justify-between items-center px-8 py-5 bg-gray-50 border-t border-gray-200">
        <button
          onClick={addNewRow}
          className="flex items-center gap-2 px-6 py-3 bg-green-500 text-white rounded-lg font-semibold hover:bg-green-600 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Plus size={20} />
          Add New Item
        </button>

        <button
          onClick={onCalculateTotal}
          className="flex items-center gap-2 px-6 py-3 bg-blue-500 text-white rounded-lg font-semibold hover:bg-blue-600 transition-all duration-200 hover:-translate-y-0.5"
        >
          <Calculator size={20} />
          Calculate Total
        </button>
      </div>

      {showGrandTotal && (
        <div className="px-8 py-5 bg-green-800 text-white text-right border-t border-gray-200">
          <p className="text-2xl font-bold m-0">Grand Total: ₹{grandTotal.toFixed(2)}</p>
        </div>
      )}
    </div>
  )
}

export default BillingTable
