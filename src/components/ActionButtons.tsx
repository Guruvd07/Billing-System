import React from 'react';
import { Download, Printer } from 'lucide-react';

interface ActionButtonsProps {
  onGeneratePDF: () => void;
  onPrint: () => void;
  disabled: boolean;
}

const ActionButtons: React.FC<ActionButtonsProps> = ({ onGeneratePDF, onPrint, disabled }) => {
  return (
    <div className="flex justify-center gap-6 mb-8">
      <button
        onClick={onGeneratePDF}
        disabled={disabled}
        className="flex items-center gap-3 px-7 py-4 bg-red-600 text-white rounded-lg font-semibold text-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
      >
        <Download size={24} />
        Generate PDF (Perfect Marathi)
      </button>
      
      <button
        onClick={onPrint}
        disabled={disabled}
        className="flex items-center gap-3 px-7 py-4 bg-purple-600 text-white rounded-lg font-semibold text-lg hover:bg-purple-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-all duration-200 hover:-translate-y-0.5"
      >
        <Printer size={24} />
        Print Bill
      </button>
    </div>
  );
};

export default ActionButtons;