import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { useWishlist } from '../contexts/WishlistContext';
import { useCart } from '../contexts/CartContext';
import { getProductById, formatPrice, calcDiscount } from '../data/products';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCart } = useCart();
  const navigate = useNavigate();

  const wishlistProducts = wishlist
    .map((id) => getProductById(id))
    .filter(Boolean) as NonNullable<ReturnType<typeof getProductById>>[];

  if (wishlistProducts.length === 0) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-20 text-center">
        <Heart className="w-20 h-20 text-gray-200 mx-auto mb-6" />
        <h2 className="text-2xl font-bold text-gray-900 mb-2">Your wishlist is empty</h2>
        <p className="text-gray-500 mb-8">Save items you love to your wishlist!</p>
        <Link
          to="/"
          className="inline-block bg-brand-red text-white font-bold px-8 py-3 rounded-sm hover:bg-brand-red-dark transition-colors uppercase tracking-wide text-sm"
        >
          Explore Products
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Heart className="w-6 h-6 text-brand-red fill-brand-red" />
        <h1 className="font-display text-2xl font-bold text-gray-900">
          My Wishlist ({wishlistProducts.length})
        </h1>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {wishlistProducts.map((product) => {
          const discount = calcDiscount(product.price, product.mrp);
          return (
            <div
              key={product.id}
              className="bg-white border border-gray-200 rounded-sm overflow-hidden shadow-card hover:shadow-card-hover transition-all"
            >
              <button
                onClick={() => navigate({ to: '/product/$id', params: { id: product.id } })}
                className="block w-full text-left"
              >
                <div className="relative bg-gray-50" style={{ paddingBottom: '100%' }}>
                  <img
                    src={product.imageUrl}
                    alt={product.name}
                    className="absolute inset-0 w-full h-full object-contain p-4"
                  />
                  <div className="absolute top-2 left-2 bg-brand-red text-white text-xs font-bold px-2 py-0.5 rounded-sm">
                    {discount}% OFF
                  </div>
                </div>
              </button>
              <div className="p-3">
                <button
                  onClick={() => navigate({ to: '/product/$id', params: { id: product.id } })}
                  className="block w-full text-left"
                >
                  <h3 className="font-semibold text-gray-900 text-sm mb-1 hover:text-brand-red transition-colors line-clamp-2">
                    {product.name}
                  </h3>
                </button>
                <div className="flex items-baseline gap-2 mb-3">
                  <span className="font-bold text-gray-900">{formatPrice(product.price)}</span>
                  <span className="text-xs text-gray-400 line-through">{formatPrice(product.mrp)}</span>
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => {
                      addToCart(product.id);
                      navigate({ to: '/cart' });
                    }}
                    className="flex-1 flex items-center justify-center gap-1.5 bg-brand-red hover:bg-brand-red-dark text-white text-xs font-bold py-2 rounded-sm uppercase tracking-wide transition-colors"
                  >
                    <ShoppingCart className="w-3.5 h-3.5" />
                    Add to Cart
                  </button>
                  <button
                    onClick={() => removeFromWishlist(product.id)}
                    className="p-2 border border-gray-300 rounded-sm text-gray-500 hover:text-brand-red hover:border-brand-red transition-colors"
                    aria-label="Remove from wishlist"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
