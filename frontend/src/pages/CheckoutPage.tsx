import { useState } from 'react';
import { useNavigate } from '@tanstack/react-router';
import { CheckCircle, CreditCard, Banknote, MapPin, ChevronRight } from 'lucide-react';
import { useCart } from '../contexts/CartContext';
import { formatPrice } from '../data/products';
import { useCreateOrder } from '../hooks/useQueries';
import { useInternetIdentity } from '../hooks/useInternetIdentity';

interface AddressForm {
  name: string;
  phone: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
  pincode: string;
}

const INDIAN_STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh',
  'Goa', 'Gujarat', 'Haryana', 'Himachal Pradesh', 'Jharkhand', 'Karnataka',
  'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur', 'Meghalaya', 'Mizoram',
  'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu',
  'Telangana', 'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal',
  'Delhi', 'Jammu & Kashmir', 'Ladakh',
];

export default function CheckoutPage() {
  const navigate = useNavigate();
  const { items, subtotal, clearCart } = useCart();
  const { identity } = useInternetIdentity();
  const createOrderMutation = useCreateOrder();

  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isPlacing, setIsPlacing] = useState(false);
  const [errors, setErrors] = useState<Partial<AddressForm>>({});

  const [address, setAddress] = useState<AddressForm>({
    name: '',
    phone: '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    pincode: '',
  });

  const deliveryCharge = subtotal >= 999 ? 0 : 99;
  const grandTotal = subtotal + deliveryCharge;

  const validateAddress = (): boolean => {
    const newErrors: Partial<AddressForm> = {};
    if (!address.name.trim()) newErrors.name = 'Name is required';
    if (!address.phone.trim() || !/^\d{10}$/.test(address.phone)) newErrors.phone = 'Valid 10-digit phone required';
    if (!address.address1.trim()) newErrors.address1 = 'Address is required';
    if (!address.city.trim()) newErrors.city = 'City is required';
    if (!address.state) newErrors.state = 'State is required';
    if (!address.pincode.trim() || !/^\d{6}$/.test(address.pincode)) newErrors.pincode = 'Valid 6-digit pincode required';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handlePlaceOrder = async () => {
    if (items.length === 0) return;
    setIsPlacing(true);

    try {
      // Mock payment delay for Razorpay
      if (paymentMethod === 'razorpay') {
        await new Promise((resolve) => setTimeout(resolve, 1500));
      }

      const addressStr = `${address.name}, ${address.phone}, ${address.address1}${address.address2 ? ', ' + address.address2 : ''}, ${address.city}, ${address.state} - ${address.pincode}`;
      const orderId = `ZTK${Date.now()}`;

      // Try to create order via backend if authenticated
      if (identity) {
        try {
          const orderItems = items.map((item) => ({
            productId: item.productId,
            quantity: BigInt(item.quantity),
          }));
          const result = await createOrderMutation.mutateAsync({
            items: orderItems,
            paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery',
            address: addressStr,
          });

          // Store in localStorage for order history display
          const storedOrders = JSON.parse(localStorage.getItem('zentek_orders') || '[]');
          storedOrders.unshift({
            orderId: result.id,
            date: new Date().toISOString(),
            items: items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
            totalAmount: grandTotal,
            paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery',
          });
          localStorage.setItem('zentek_orders', JSON.stringify(storedOrders));

          clearCart();
          navigate({ to: `/order-success/${result.id}` });
          return;
        } catch {
          // Fall through to local order
        }
      }

      // Local order (not authenticated or backend failed)
      const storedOrders = JSON.parse(localStorage.getItem('zentek_orders') || '[]');
      storedOrders.unshift({
        orderId,
        date: new Date().toISOString(),
        items: items.map((i) => ({ name: i.product.name, quantity: i.quantity, price: i.product.price })),
        totalAmount: grandTotal,
        paymentMethod: paymentMethod === 'razorpay' ? 'Razorpay' : 'Cash on Delivery',
      });
      localStorage.setItem('zentek_orders', JSON.stringify(storedOrders));

      clearCart();
      navigate({ to: `/order-success/${orderId}` });
    } finally {
      setIsPlacing(false);
    }
  };

  if (items.length === 0 && step === 1) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Your cart is empty</h2>
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-brand-red hover:underline font-medium"
        >
          Continue Shopping
        </button>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <h1 className="font-display text-2xl font-bold text-gray-900 mb-6">Checkout</h1>

      {/* Step Indicator */}
      <div className="flex items-center gap-2 mb-8">
        {[1, 2].map((s) => (
          <div key={s} className="flex items-center gap-2">
            <div
              className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold transition-colors ${
                step >= s ? 'bg-brand-red text-white' : 'bg-gray-200 text-gray-500'
              }`}
            >
              {step > s ? <CheckCircle className="w-4 h-4" /> : s}
            </div>
            <span className={`text-sm font-medium ${step >= s ? 'text-gray-900' : 'text-gray-400'}`}>
              {s === 1 ? 'Delivery Address' : 'Payment'}
            </span>
            {s < 2 && <ChevronRight className="w-4 h-4 text-gray-300" />}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
          {/* Step 1: Address */}
          {step === 1 && (
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs">
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <MapPin className="w-5 h-5 text-brand-red" />
                Delivery Address
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    value={address.name}
                    onChange={(e) => setAddress({ ...address, name: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors ${errors.name ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Rahul Sharma"
                  />
                  {errors.name && <p className="text-xs text-red-500 mt-1">{errors.name}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    value={address.phone}
                    onChange={(e) => setAddress({ ...address, phone: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors ${errors.phone ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="9876543210"
                    maxLength={10}
                  />
                  {errors.phone && <p className="text-xs text-red-500 mt-1">{errors.phone}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Address Line 1 *
                  </label>
                  <input
                    type="text"
                    value={address.address1}
                    onChange={(e) => setAddress({ ...address, address1: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors ${errors.address1 ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="House No., Street, Area"
                  />
                  {errors.address1 && <p className="text-xs text-red-500 mt-1">{errors.address1}</p>}
                </div>
                <div className="sm:col-span-2">
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Address Line 2
                  </label>
                  <input
                    type="text"
                    value={address.address2}
                    onChange={(e) => setAddress({ ...address, address2: e.target.value })}
                    className="w-full border border-gray-300 rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors"
                    placeholder="Landmark, Colony (optional)"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    City *
                  </label>
                  <input
                    type="text"
                    value={address.city}
                    onChange={(e) => setAddress({ ...address, city: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors ${errors.city ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="Mumbai"
                  />
                  {errors.city && <p className="text-xs text-red-500 mt-1">{errors.city}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    State *
                  </label>
                  <select
                    value={address.state}
                    onChange={(e) => setAddress({ ...address, state: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors bg-white ${errors.state ? 'border-red-400' : 'border-gray-300'}`}
                  >
                    <option value="">Select State</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </select>
                  {errors.state && <p className="text-xs text-red-500 mt-1">{errors.state}</p>}
                </div>
                <div>
                  <label className="block text-xs font-semibold text-gray-700 mb-1 uppercase tracking-wide">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    value={address.pincode}
                    onChange={(e) => setAddress({ ...address, pincode: e.target.value })}
                    className={`w-full border rounded-sm px-3 py-2 text-sm focus:outline-none focus:border-brand-red transition-colors ${errors.pincode ? 'border-red-400' : 'border-gray-300'}`}
                    placeholder="400001"
                    maxLength={6}
                  />
                  {errors.pincode && <p className="text-xs text-red-500 mt-1">{errors.pincode}</p>}
                </div>
              </div>
              <button
                onClick={() => {
                  if (validateAddress()) setStep(2);
                }}
                className="mt-6 w-full bg-brand-red hover:bg-brand-red-dark text-white font-bold py-3 rounded-sm uppercase tracking-wide text-sm transition-colors"
              >
                Continue to Payment
              </button>
            </div>
          )}

          {/* Step 2: Payment */}
          {step === 2 && (
            <div className="bg-white border border-gray-200 rounded-sm p-6 shadow-xs">
              <h2 className="font-semibold text-gray-900 mb-5 flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-brand-red" />
                Choose Payment Method
              </h2>

              <div className="space-y-3 mb-6">
                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-sm cursor-pointer transition-colors ${
                    paymentMethod === 'razorpay' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="accent-brand-red"
                  />
                  <CreditCard className="w-6 h-6 text-blue-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Razorpay</p>
                    <p className="text-xs text-gray-500">UPI, Credit/Debit Cards, NetBanking, Wallets</p>
                  </div>
                  <span className="ml-auto text-xs bg-blue-100 text-blue-700 px-2 py-0.5 rounded font-medium">
                    Recommended
                  </span>
                </label>

                <label
                  className={`flex items-center gap-4 p-4 border-2 rounded-sm cursor-pointer transition-colors ${
                    paymentMethod === 'cod' ? 'border-brand-red bg-red-50' : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <input
                    type="radio"
                    name="payment"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="accent-brand-red"
                  />
                  <Banknote className="w-6 h-6 text-green-600" />
                  <div>
                    <p className="font-semibold text-gray-900">Cash on Delivery</p>
                    <p className="text-xs text-gray-500">Pay when your order arrives</p>
                  </div>
                </label>
              </div>

              {/* Delivery Address Summary */}
              <div className="bg-gray-50 rounded-sm p-3 mb-6 text-sm text-gray-600">
                <p className="font-semibold text-gray-900 mb-1 flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-brand-red" />
                  Delivering to:
                </p>
                <p>{address.name} · {address.phone}</p>
                <p>{address.address1}{address.address2 ? ', ' + address.address2 : ''}</p>
                <p>{address.city}, {address.state} - {address.pincode}</p>
              </div>

              <div className="flex gap-3">
                <button
                  onClick={() => setStep(1)}
                  className="flex-1 border-2 border-gray-300 text-gray-700 font-bold py-3 rounded-sm uppercase tracking-wide text-sm hover:border-gray-400 transition-colors"
                >
                  Back
                </button>
                <button
                  onClick={handlePlaceOrder}
                  disabled={isPlacing}
                  className="flex-1 bg-brand-red hover:bg-brand-red-dark disabled:opacity-60 text-white font-bold py-3 rounded-sm uppercase tracking-wide text-sm transition-colors flex items-center justify-center gap-2"
                >
                  {isPlacing ? (
                    <>
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      {paymentMethod === 'razorpay' ? 'Processing Payment...' : 'Placing Order...'}
                    </>
                  ) : (
                    `Place Order · ${formatPrice(grandTotal)}`
                  )}
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Order Summary */}
        <div className="bg-white border border-gray-200 rounded-sm p-4 shadow-xs h-fit">
          <h3 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wide">
            Order Summary
          </h3>
          <div className="space-y-3 mb-4">
            {items.map((item) => (
              <div key={item.productId} className="flex gap-3 items-center">
                <img
                  src={item.product.imageUrl}
                  alt={item.product.name}
                  className="w-12 h-12 object-contain bg-gray-50 rounded border border-gray-100 flex-shrink-0"
                />
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-medium text-gray-900 line-clamp-2">{item.product.name}</p>
                  <p className="text-xs text-gray-500">Qty: {item.quantity}</p>
                </div>
                <p className="text-xs font-bold text-gray-900 flex-shrink-0">
                  {formatPrice(item.product.price * item.quantity)}
                </p>
              </div>
            ))}
          </div>
          <div className="border-t border-gray-200 pt-3 space-y-1.5 text-sm">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal</span>
              <span>{formatPrice(subtotal)}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Delivery</span>
              {deliveryCharge === 0 ? (
                <span className="text-green-600 font-medium">FREE</span>
              ) : (
                <span>{formatPrice(deliveryCharge)}</span>
              )}
            </div>
            <div className="flex justify-between font-bold text-gray-900 text-base border-t border-gray-200 pt-2 mt-2">
              <span>Total</span>
              <span>{formatPrice(grandTotal)}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
