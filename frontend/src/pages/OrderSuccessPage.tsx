import { useParams, Link } from '@tanstack/react-router';
import { CheckCircle, Package, Home, ArrowRight } from 'lucide-react';

export default function OrderSuccessPage() {
  const { orderId } = useParams({ from: '/order-success/$orderId' });

  return (
    <div className="max-w-2xl mx-auto px-4 py-16 text-center">
      {/* Success Icon */}
      <div className="flex justify-center mb-6">
        <div className="w-24 h-24 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-14 h-14 text-green-500" />
        </div>
      </div>

      <h1 className="font-display text-3xl font-black text-gray-900 mb-3">
        Order Placed Successfully! 🎉
      </h1>
      <p className="text-gray-500 mb-6 text-base">
        Thank you for shopping with ZENTEK. Your order has been confirmed and will be delivered soon.
      </p>

      {/* Order ID */}
      <div className="bg-gray-50 border border-gray-200 rounded-sm p-4 mb-8 inline-block">
        <p className="text-xs text-gray-500 uppercase tracking-wide mb-1">Order ID</p>
        <p className="font-mono font-bold text-gray-900 text-lg">{orderId}</p>
      </div>

      {/* Info Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10 text-left">
        {[
          { icon: '📦', title: 'Order Confirmed', desc: 'Your order is being processed' },
          { icon: '🚚', title: 'Estimated Delivery', desc: '3–5 business days' },
          { icon: '📱', title: 'Track Order', desc: 'Check your order history' },
        ].map((item) => (
          <div key={item.title} className="bg-white border border-gray-200 rounded-sm p-4 text-center">
            <span className="text-2xl block mb-2">{item.icon}</span>
            <p className="font-semibold text-gray-900 text-sm">{item.title}</p>
            <p className="text-xs text-gray-500 mt-1">{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Action Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/"
          className="inline-flex items-center justify-center gap-2 bg-brand-red hover:bg-brand-red-dark text-white font-bold px-8 py-3 rounded-sm uppercase tracking-wide text-sm transition-colors"
        >
          <Home className="w-4 h-4" />
          Continue Shopping
        </Link>
        <Link
          to="/orders"
          className="inline-flex items-center justify-center gap-2 border-2 border-gray-300 text-gray-700 hover:border-brand-red hover:text-brand-red font-bold px-8 py-3 rounded-sm uppercase tracking-wide text-sm transition-colors"
        >
          <Package className="w-4 h-4" />
          View Orders
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
}
