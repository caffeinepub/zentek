import { Link, useNavigate } from '@tanstack/react-router';
import { Package, ShoppingBag, Calendar, CreditCard, Banknote } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { formatPrice } from '../data/products';

interface StoredOrder {
  orderId: string;
  date: string;
  items: { name: string; quantity: number; price: number }[];
  totalAmount: number;
  paymentMethod: string;
}

export default function OrderHistoryPage() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  if (!isAuthenticated) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Package className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Please Login</h2>
        <p className="text-gray-500 mb-8">You need to be logged in to view your orders.</p>
        <button
          onClick={() => navigate({ to: '/login' })}
          className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-sm hover:bg-brand-red-dark transition-colors uppercase tracking-wide text-sm"
        >
          Login
        </button>
      </div>
    );
  }

  const orders: StoredOrder[] = (() => {
    try {
      return JSON.parse(localStorage.getItem('zentek_orders') || '[]');
    } catch {
      return [];
    }
  })();

  if (orders.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">No Orders Yet</h2>
        <p className="text-gray-500 mb-8">You haven't placed any orders yet.</p>
        <Link
          to="/"
          className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-sm hover:bg-brand-red-dark transition-colors uppercase tracking-wide text-sm"
        >
          Start Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Package className="w-6 h-6 text-brand-red" />
        <h1 className="font-display text-2xl font-bold text-gray-900">Order History</h1>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <div
            key={order.orderId}
            className="bg-white border border-gray-200 rounded-sm shadow-xs overflow-hidden"
          >
            {/* Order Header */}
            <div className="bg-gray-50 border-b border-gray-200 px-4 py-3 flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-4 flex-wrap">
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Order ID</p>
                  <p className="font-mono font-bold text-gray-900 text-sm">{order.orderId}</p>
                </div>
                <div>
                  <p className="text-xs text-gray-500 uppercase tracking-wide">Date</p>
                  <p className="text-sm font-medium text-gray-900 flex items-center gap-1">
                    <Calendar className="w-3.5 h-3.5" />
                    {new Date(order.date).toLocaleDateString('en-IN', {
                      day: 'numeric',
                      month: 'short',
                      year: 'numeric',
                    })}
                  </p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-sm text-gray-600">
                  {order.paymentMethod === 'Cash on Delivery' ? (
                    <Banknote className="w-4 h-4 text-green-600" />
                  ) : (
                    <CreditCard className="w-4 h-4 text-blue-600" />
                  )}
                  {order.paymentMethod}
                </div>
                <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded-sm uppercase">
                  Confirmed
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="px-4 py-3">
              <div className="space-y-2">
                {order.items.map((item, idx) => (
                  <div key={idx} className="flex justify-between items-center text-sm">
                    <span className="text-gray-700">
                      {item.name}{' '}
                      <span className="text-gray-400">× {item.quantity}</span>
                    </span>
                    <span className="font-medium text-gray-900">
                      {formatPrice(item.price * item.quantity)}
                    </span>
                  </div>
                ))}
              </div>
              <div className="border-t border-gray-100 mt-3 pt-3 flex justify-between items-center">
                <span className="text-sm font-semibold text-gray-900">Total Amount</span>
                <span className="font-bold text-gray-900 text-base">
                  {formatPrice(order.totalAmount)}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
