import { Link } from '@tanstack/react-router';
import { Heart, Phone, RotateCcw, Shield, Mail } from 'lucide-react';

export default function Footer() {
  const hostname = typeof window !== 'undefined' ? window.location.hostname : 'unknown-app';
  const utmContent = encodeURIComponent(hostname);

  return (
    <footer className="bg-gray-900 text-gray-300 mt-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {/* Customer Care */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Phone className="w-4 h-4 text-brand-red" />
              Customer Care
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Help Center</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Track Order</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Shipping Info</a></li>
              <li><a href="#" className="hover:text-white transition-colors">FAQs</a></li>
            </ul>
          </div>

          {/* Returns */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <RotateCcw className="w-4 h-4 text-brand-red" />
              Returns
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Return Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Exchange Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Refund Status</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Initiate Return</a></li>
            </ul>
          </div>

          {/* Privacy Policy */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Shield className="w-4 h-4 text-brand-red" />
              Privacy Policy
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-white transition-colors">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Terms of Use</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Cookie Policy</a></li>
              <li><a href="#" className="hover:text-white transition-colors">Data Security</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4 flex items-center gap-2">
              <Mail className="w-4 h-4 text-brand-red" />
              Contact
            </h3>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@zentek.in" className="hover:text-white transition-colors">support@zentek.in</a></li>
              <li><a href="tel:1800-123-4567" className="hover:text-white transition-colors">1800-123-4567 (Toll Free)</a></li>
              <li className="text-gray-500 text-xs">Mon–Sat: 9AM – 6PM IST</li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-700 mt-10 pt-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs text-gray-500">
          <div className="flex items-center gap-1">
            <span className="font-display font-bold text-brand-red text-sm">ZENTEK</span>
            <span>© {new Date().getFullYear()} All rights reserved.</span>
          </div>
          <div className="flex items-center gap-1">
            <span>Built with</span>
            <Heart className="w-3 h-3 fill-brand-red text-brand-red" />
            <span>using</span>
            <a
              href={`https://caffeine.ai/?utm_source=Caffeine-footer&utm_medium=referral&utm_content=${utmContent}`}
              target="_blank"
              rel="noopener noreferrer"
              className="text-brand-red hover:underline font-medium"
            >
              caffeine.ai
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
