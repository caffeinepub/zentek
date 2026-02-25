import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, Truck } from 'lucide-react';
import { LocalProduct, calcDiscount, formatPrice } from '../../data/products';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useState } from 'react';

interface ProductCardProps {
  product: LocalProduct;
}

export default function ProductCard({ product }: ProductCardProps) {
  const { addToCart, items } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const navigate = useNavigate();
  const [addedFeedback, setAddedFeedback] = useState(false);
  const discount = calcDiscount(product.price, product.mrp);
  const inCart = items.some((i) => i.productId === product.id);
  const wishlisted = isInWishlist(product.id);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product.id);
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1500);
  };

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  const handleCardClick = () => {
    navigate({ to: '/product/$id', params: { id: product.id } });
  };

  return (
    <div
      className="block group cursor-pointer"
      onClick={handleCardClick}
    >
      <div className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-card hover:shadow-card-hover transition-all duration-200 hover:-translate-y-0.5 h-full flex flex-col">
        {/* Image */}
        <div className="relative bg-gray-50 overflow-hidden" style={{ paddingBottom: '100%' }}>
          <img
            src={product.imageUrl}
            alt={product.name}
            className="absolute inset-0 w-full h-full object-contain p-4 group-hover:scale-105 transition-transform duration-300"
            loading="lazy"
          />
          {/* Discount Badge */}
          <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-1 rounded-sm">
            {discount}% OFF
          </div>
          {/* Wishlist Button */}
          <button
            onClick={handleWishlist}
            className="absolute top-2 right-2 bg-white rounded-full p-1.5 shadow-sm hover:shadow-md transition-all"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
          >
            <Heart
              className={`w-4 h-4 transition-colors ${
                wishlisted ? 'fill-brand-red text-brand-red' : 'text-gray-400 hover:text-brand-red'
              }`}
            />
          </button>
        </div>

        {/* Info */}
        <div className="p-3 flex flex-col flex-1">
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 leading-snug">
            {product.name}
          </h3>

          {/* Price Row */}
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-base font-bold text-gray-900">{formatPrice(product.price)}</span>
            <span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span>
          </div>

          {/* Badges */}
          <div className="flex flex-wrap gap-1 mb-3 mt-auto">
            <span className="inline-flex items-center gap-1 text-[10px] text-green-700 font-medium">
              <Truck className="w-3 h-3" />
              Free Delivery
            </span>
            {product.codAvailable && (
              <span className="inline-flex items-center text-[10px] bg-green-50 text-green-700 border border-green-200 rounded-sm px-1.5 py-0.5 font-medium">
                COD Available
              </span>
            )}
          </div>

          {/* Add to Cart */}
          <button
            onClick={handleAddToCart}
            className={`w-full py-2 text-xs font-bold uppercase tracking-wide rounded-sm transition-all flex items-center justify-center gap-1.5 ${
              addedFeedback
                ? 'bg-green-600 text-white'
                : inCart
                ? 'bg-gray-100 text-gray-700 hover:bg-brand-red hover:text-white border border-gray-300'
                : 'bg-brand-red text-white hover:bg-brand-red-dark'
            }`}
          >
            <ShoppingCart className="w-3.5 h-3.5" />
            {addedFeedback ? 'Added!' : inCart ? 'In Cart' : 'Add to Cart'}
          </button>
        </div>
      </div>
    </div>
  );
}
