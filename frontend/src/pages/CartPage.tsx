import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Trash2, Plus, Minus, ShoppingBag, Truck, CreditCard, Banknote } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../data/products';

export default function CartPage() {
  const { items, updateQuantity, removeFromCart, subtotal } = useCart();
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isProcessing, setIsProcessing] = useState(false);

  const totalMrp = items.reduce((sum, i) => sum + i.product.mrp * i.quantity, 0);
  const savings = totalMrp - subtotal;
  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  const handleProceedToPay = async () => {
    if (items.length === 0) return;
    setIsProcessing(true);

    if (paymentMethod === 'razorpay') {
      // Mock Razorpay flow
      await new Promise((resolve) => setTimeout(resolve, 1500));
    }

    setIsProcessing(false);
    navigate({ to: '/checkout' });
  };

  if (items.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <ShoppingBag className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your cart is empty</h2>
        <p className="text-gray-500 mb-8">Add some products to get started!</p>
        <Link
          to="/"
          className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-sm hover:bg-brand-red-dark transition-colors uppercase tracking-wide text-sm"
        >
          Continue Shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">
        Shopping Cart ({items.length} {items.length === 1 ? 'item' : 'items'})
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Cart Items */}
        <div className="lg:col-span-2 space-y-4">
          {items.map((item) => (
            <div
              key={item.productId}
              className="bg-white border border-gray-200 rounded-sm p-4 flex gap-4 shadow-xs"
            >
              <button
                onClick={() => navigate({ to: '/product/$id', params: { id: item.productId } })}
                className="flex-shrink-0"
              >
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-24 h-24 object-contain bg-gray-50 rounded-sm border border-gray-100"
                />
              </button>
              <div className="flex-1 min-w-0">
                <button
                  onClick={() => navigate({ to: '/product/$id', params: { id: item.productId } })}
                  className="text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-sm hover:text-brand-red transition-colors line-clamp-2">
                    {item.product.name}
                  </h3>
                </button>
                <div className="flex items-baseline gap-2 mt-1">
                  <span className="font-bold text-gray-900">{formatPrice(item.product.price)}</span>
                  <span className="text-xs text-gray-400 line-through">{formatPrice(item.product.mrp)}</span>
                </div>
                {item.product.codAvailable && (
                  <span className="text-xs text-green-600 font-medium">COD Available</span>
                )}
                <div className="flex items-center gap-3 mt-3">
                  {/* Quantity Controls */}
                  <div className="flex items-center border border-gray-300 rounded-sm">
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Minus className="w-3.5 h-3.5" />
                    </button>
                    <span className="px-3 text-sm font-semibold min-w-[32px] text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="p-1.5 hover:bg-gray-100 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                    </button>
                  </div>
                  <button
                    onClick={() => removeFromCart(item.productId)}
                    className="flex items-center gap-1 text-xs text-gray-500 hover:text-brand-red transition-colors"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    Remove
                  </button>
                </div>
              </div>
              <div className="text-right flex-shrink-0">
                <p className="font-bold text-gray-900">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Price Summary */}
        <div className="space-y-4">
          {/* Payment Method */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs">
            <h3 className="font-semibold text-gray-900 mb-3 text-sm uppercase tracking-wide">
              Payment Method
            </h3>
            <div className="space-y-2">
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="razorpay"
                  checked={paymentMethod === 'razorpay'}
                  onChange={() => setPaymentMethod('razorpay')}
                  className="accent-brand-red"
                />
                <CreditCard className="w-4 h-4 text-blue-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Razorpay</p>
                  <p className="text-xs text-gray-500">UPI, Cards, NetBanking</p>
                </div>
              </label>
              <label className="flex items-center gap-3 cursor-pointer p-2 rounded hover:bg-gray-50">
                <input
                  type="radio"
                  name="payment"
                  value="cod"
                  checked={paymentMethod === 'cod'}
                  onChange={() => setPaymentMethod('cod')}
                  className="accent-brand-red"
                />
                <Banknote className="w-4 h-4 text-green-600" />
                <div>
                  <p className="text-sm font-medium text-gray-900">Cash on Delivery</p>
                  <p className="text-xs text-gray-500">Pay when delivered</p>
                </div>
              </label>
            </div>
          </div>

          {/* Price Breakdown */}
          <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs">
            <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
              Price Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between text-gray-600">
                <span>Price ({items.length} items)</span>
                <span>{formatPrice(totalMrp)}</span>
              </div>
              <div className="flex justify-between text-green-600 font-medium">
                <span>Discount</span>
                <span>− {formatPrice(savings)}</span>
              </div>
              <div className="flex justify-between text-gray-600">
                <span className="flex items-center gap-1">
                  <Truck className="w-3.5 h-3.5" />
                  Delivery
                </span>
                {deliveryCharge === 0 ? (
                  <span className="text-green-600 font-medium">FREE</span>
                ) : (
                  <span>{formatPrice(deliveryCharge)}</span>
                )}
              </div>
              {deliveryCharge > 0 && (
                <p className="text-xs text-gray-400">Add ₹{999 - subtotal} more for free delivery</p>
              )}
              <div className="border-t border-gray-200 pt-2 mt-2 flex justify-between font-bold text-gray-900 text-base">
                <span>Total Amount</span>
                <span>{formatPrice(grandTotal)}</span>
              </div>
              {savings > 0 && (
                <p className="text-green-600 text-xs font-medium text-center bg-green-50 rounded py-1">
                  🎉 You save {formatPrice(savings)} on this order!
                </p>
              )}
            </div>

            <button
              onClick={handleProceedToPay}
              disabled={isProcessing}
              className="w-full mt-4 bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-sm uppercase tracking-wide text-sm transition-colors flex items-center justify-center gap-2"
            >
              {isProcessing ? (
                <>
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Processing...
                </>
              ) : (
                'Proceed to Pay'
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
