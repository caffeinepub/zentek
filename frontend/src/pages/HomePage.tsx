import HeroCarousel from '../components/home/HeroCarousel';
import BankOfferStrip from '../components/home/BankOfferStrip';
import ProductCard from '../components/product/ProductCard';
import { PRODUCTS } from '../data/products';
import { Zap } from 'lucide-react';

export default function HomePage() {
  return (
    <div>
      <HeroCarousel />
      <BankOfferStrip />

      {/* Products Section */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
        <div className="flex items-center gap-3 mb-6">
          <div className="w-1 h-7 bg-brand-red rounded-full" />
          <h2 className="font-display text-2xl font-bold text-gray-900">Featured Products</h2>
          <Zap className="w-5 h-5 text-brand-red fill-brand-red" />
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
          {PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* Why ZENTEK */}
      <section className="bg-gray-50 border-t border-gray-100 py-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              { icon: '🚚', title: 'Free Delivery', desc: 'On orders above ₹999' },
              { icon: '🔄', title: 'Easy Returns', desc: '7-day hassle-free returns' },
              { icon: '🔒', title: 'Secure Payments', desc: 'SSL encrypted checkout' },
              { icon: '💬', title: '24/7 Support', desc: 'Always here to help' },
            ].map((item) => (
              <div key={item.title} className="flex flex-col items-center gap-2">
                <span className="text-3xl">{item.icon}</span>
                <h3 className="font-semibold text-gray-900 text-sm">{item.title}</h3>
                <p className="text-xs text-gray-500">{item.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
