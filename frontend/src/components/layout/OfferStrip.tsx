export default function OfferStrip() {
  return (
    <div className="bg-brand-red text-white text-center py-2 px-4 text-xs sm:text-sm font-medium tracking-wide">
      <span className="inline-flex items-center gap-3 flex-wrap justify-center">
        <span>🚚 Free Delivery above ₹999</span>
        <span className="opacity-60">|</span>
        <span>💳 COD Available</span>
        <span className="opacity-60">|</span>
        <span>🔒 Secure Payments</span>
      </span>
    </div>
  );
}
