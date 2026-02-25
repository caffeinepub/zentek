import { CreditCard } from 'lucide-react';

export default function BankOfferStrip() {
  return (
    <div className="bg-gradient-to-r from-blue-50 to-indigo-50 border-y border-blue-100 py-3 px-4">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-3 flex-wrap text-sm">
        <CreditCard className="w-4 h-4 text-blue-600 flex-shrink-0" />
        <span className="font-semibold text-blue-800">Bank Offer:</span>
        <span className="text-blue-700">10% Instant Discount on HDFC Bank Credit & Debit Cards</span>
        <span className="text-blue-500 text-xs border border-blue-300 rounded px-2 py-0.5 font-medium">
          T&C Apply
        </span>
      </div>
    </div>
  );
}
