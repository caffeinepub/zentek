import { Outlet } from '@tanstack/react-router';
import OfferStrip from './OfferStrip';
import Header from './Header';
import Footer from './Footer';

export default function Layout() {
  return (
    <div className="min-h-screen flex flex-col bg-white">
      <OfferStrip />
      <Header />
      <main className="flex-1">
        <Outlet />
      </main>
      <Footer />
    </div>
  );
}
