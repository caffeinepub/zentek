import { useState } from 'react';
import { Link, useNavigate } from '@tanstack/react-router';
import { Heart, ShoppingCart, User, Search, LogOut, Package, ChevronDown } from 'lucide-react';
import { useCart } from '../../contexts/CartContext';
import { useWishlist } from '../../contexts/WishlistContext';
import { useAuth } from '../../contexts/AuthContext';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

export default function Header() {
  const { totalItems } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleLogout = () => {
    logout();
    navigate({ to: '/' });
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    // Search bar is decorative per spec
  };

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center h-16 gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-1">
              <span className="font-display font-900 text-2xl tracking-tight text-brand-red">
                ZEN
              </span>
              <span className="font-display font-900 text-2xl tracking-tight text-gray-900">
                TEK
              </span>
            </div>
          </Link>

          {/* Search Bar */}
          <form onSubmit={handleSearch} className="flex-1 max-w-xl mx-auto hidden sm:block">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search for products, brands and more"
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-sm text-sm focus:outline-none focus:border-brand-red bg-gray-50 focus:bg-white transition-colors"
              />
            </div>
          </form>

          {/* Right Icons */}
          <div className="flex items-center gap-1 sm:gap-2 ml-auto sm:ml-0">
            {/* Wishlist */}
            <Link
              to="/wishlist"
              className="relative flex flex-col items-center p-2 text-gray-700 hover:text-brand-red transition-colors group"
            >
              <Heart className="w-5 h-5 group-hover:fill-brand-red transition-all" />
              {wishlist.length > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
              <span className="text-[10px] hidden sm:block mt-0.5 font-medium">Wishlist</span>
            </Link>

            {/* Cart */}
            <Link
              to="/cart"
              className="relative flex flex-col items-center p-2 text-gray-700 hover:text-brand-red transition-colors group"
            >
              <ShoppingCart className="w-5 h-5" />
              {totalItems > 0 && (
                <span className="absolute -top-0.5 -right-0.5 bg-brand-red text-white text-[10px] font-bold rounded-full w-4 h-4 flex items-center justify-center">
                  {totalItems}
                </span>
              )}
              <span className="text-[10px] hidden sm:block mt-0.5 font-medium">Cart</span>
            </Link>

            {/* User */}
            {isAuthenticated && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex flex-col items-center p-2 text-gray-700 hover:text-brand-red transition-colors">
                    <div className="flex items-center gap-1">
                      <User className="w-5 h-5" />
                      <ChevronDown className="w-3 h-3" />
                    </div>
                    <span className="text-[10px] hidden sm:block mt-0.5 font-medium max-w-[60px] truncate">
                      {user.name.split(' ')[0]}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <div className="px-3 py-2 text-sm font-semibold text-gray-900 border-b">
                    Hi, {user.name.split(' ')[0]}!
                  </div>
                  <DropdownMenuItem
                    onClick={() => navigate({ to: '/orders' })}
                    className="cursor-pointer"
                  >
                    <Package className="w-4 h-4 mr-2" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-brand-red focus:text-brand-red"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Logout
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Link
                to="/login"
                className="flex flex-col items-center p-2 text-gray-700 hover:text-brand-red transition-colors"
              >
                <User className="w-5 h-5" />
                <span className="text-[10px] hidden sm:block mt-0.5 font-medium">Login</span>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
