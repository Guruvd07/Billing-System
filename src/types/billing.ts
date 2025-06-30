export interface BillingItem {
  id: number;
  name: string;
  quantity: string;
  price: string;
  total: string;
  decimal: string;
  isManualTotal: boolean;
}

export interface ItemData {
  english: string;
  marathi: string;
}

export interface SuggestionProps {
  suggestions: ItemData[];
  activeSuggestionIndex: number;
  onSelect: (index: number) => void;
  position: { top: number; left: number };
  visible: boolean;
}