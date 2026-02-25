import { useParams, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, Truck, CheckCircle, ArrowLeft, Zap } from 'lucide-react';
import { getProductById, calcDiscount, formatPrice } from '../data/products';
import { useCart } from '../contexts/CartContext';
import { useWishlist } from '../contexts/WishlistContext';
import { useState } from 'react';

export default function ProductDetailsPage() {
  const { id } = useParams({ from: '/product/$id' });
  const navigate = useNavigate();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const [addedFeedback, setAddedFeedback] = useState(false);

  const product = getProductById(id);

  if (!product) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <h2 className="text-2xl font-bold text-gray-900 mb-4">Product Not Found</h2>
        <button
          onClick={() => navigate({ to: '/' })}
          className="text-brand-red hover:underline font-medium"
        >
          Back to Home
        </button>
      </div>
    );
  }

  const discount = calcDiscount(product.price, product.mrp);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = () => {
    addToCart(product.id);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleBuyNow = () => {
    addToCart(product.id);
    navigate({ to: '/checkout' });
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Breadcrumb */}
      <button
        onClick={() => navigate({ to: '/' })}
        className="flex items-center gap-1 text-sm text-gray-500 hover:text-brand-red mb-6 transition-colors"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Products
      </button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-10">
        {/* Image */}
        <div className="bg-gray-50 rounded-sm border border-gray-200 flex items-center justify-center p-8 aspect-square">
          <img
            src={product.imageUrl}
            alt={product.name}
            className="max-w-full max-h-full object-contain"
          />
        </div>

        {/* Details */}
        <div className="flex flex-col">
          <h1 className="font-display text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
            {product.name}
          </h1>

          {/* Tagline */}
          <p className="text-gray-500 italic text-sm mb-4">{product.tagline}</p>

          {/* Price */}
          <div className="flex items-baseline gap-3 mb-2">
            <span className="text-3xl font-black text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-lg text-gray-400 line-through">{formatPrice(product.mrp)}</span>
            <span className="bg-brand-red text-white text-sm font-bold px-2 py-0.5 rounded-sm">
              {discount}% OFF
            </span>
          </div>
          <p className="text-green-600 text-sm font-medium mb-4">
            You save {formatPrice(product.mrp - product.price)}
          </p>

          {/* COD */}
          {product.codAvailable && (
            <div className="flex items-center gap-2 text-sm text-green-700 bg-green-50 border border-green-200 rounded-sm px-3 py-2 mb-4 w-fit">
              <CheckCircle className="w-4 h-4" />
              <span className="font-medium">Cash on Delivery Available</span>
            </div>
          )}

          {/* Free Delivery */}
          <div className="flex items-center gap-2 text-sm text-gray-600 mb-6">
            <Truck className="w-4 h-4 text-green-600" />
            <span>Free Delivery on this order</span>
          </div>

          {/* Description */}
          <div className="mb-6">
            <h2 className="font-semibold text-gray-900 mb-2 text-base">Product Description</h2>
            <p className="text-gray-600 text-sm leading-relaxed">{product.description}</p>
          </div>

          {/* Key Features */}
          <div className="mb-8">
            <h2 className="font-semibold text-gray-900 mb-3 text-base flex items-center gap-2">
              <Zap className="w-4 h-4 text-brand-red" />
              Key Features
            </h2>
            <ul className="space-y-2">
              {product.keyFeatures.map((feature) => (
                <li key={feature} className="flex items-center gap-2 text-sm text-gray-700">
                  <span className="w-1.5 h-1.5 bg-brand-red rounded-full flex-shrink-0" />
                  {feature}
                </li>
              ))}
            </ul>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 flex-wrap">
            <button
              onClick={handleAddToCart}
              className={`flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 font-bold text-sm uppercase tracking-wide rounded-sm transition-all border-2 ${
                addedFeedback
                  ? 'bg-green-600 border-green-600 text-white'
                  : 'border-brand-red text-brand-red hover:bg-brand-red hover:text-white'
              }`}
            >
              <ShoppingCart className="w-4 h-4" />
              {addedFeedback ? 'Added to Cart!' : 'Add to Cart'}
            </button>
            <button
              onClick={handleBuyNow}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-3 px-6 bg-brand-red hover:bg-brand-red-dark text-white font-bold text-sm uppercase tracking-wide rounded-sm transition-colors"
            >
              <Zap className="w-4 h-4" />
              Buy Now
            </button>
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`p-3 border-2 rounded-sm transition-all ${
                wishlisted
                  ? 'border-brand-red bg-red-50 text-brand-red'
                  : 'border-gray-300 text-gray-500 hover:border-brand-red hover:text-brand-red'
              }`}
              aria-label="Toggle wishlist"
            >
              <Heart className={`w-5 h-5 ${wishlisted ? 'fill-brand-red' : ''}`} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
