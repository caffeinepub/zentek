import { useState, useEffect, useCallback } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';

const slides = [
  {
    id: 1,
    image: '/assets/generated/hero-slide-1.dim_1200x400.png',
    title: 'ZENTEK MEGA SALE',
    subtitle: 'Up to 60% Off on Top Tech',
    cta: 'Shop Now',
    bg: 'from-gray-900 via-red-950 to-gray-900',
    accent: 'text-brand-red',
  },
  {
    id: 2,
    image: '/assets/generated/hero-slide-2.dim_1200x400.png',
    title: 'Tech Essentials',
    subtitle: 'For Students & Professionals',
    cta: 'Explore',
    bg: 'from-blue-950 via-slate-900 to-blue-950',
    accent: 'text-blue-400',
  },
  {
    id: 3,
    image: '/assets/generated/hero-slide-3.dim_1200x400.png',
    title: 'Bank Offer',
    subtitle: '10% Instant Discount on HDFC Cards',
    cta: 'Avail Now',
    bg: 'from-amber-950 via-yellow-900 to-amber-950',
    accent: 'text-yellow-400',
  },
];

export default function HeroCarousel() {
  const [current, setCurrent] = useState(0);
  const [imgErrors, setImgErrors] = useState<Record<number, boolean>>({});

  const next = useCallback(() => setCurrent((c) => (c + 1) % slides.length), []);
  const prev = useCallback(() => setCurrent((c) => (c - 1 + slides.length) % slides.length), []);

  useEffect(() => {
    const timer = setInterval(next, 4000);
    return () => clearInterval(timer);
  }, [next]);

  return (
    <div className="relative w-full overflow-hidden bg-gray-900" style={{ height: '320px' }}>
      {slides.map((slide, idx) => (
        <div
          key={slide.id}
          className={`absolute inset-0 transition-opacity duration-700 ${
            idx === current ? 'opacity-100 z-10' : 'opacity-0 z-0'
          }`}
        >
          {!imgErrors[idx] ? (
            <img
              src={slide.image}
              alt={slide.title}
              className="w-full h-full object-cover"
              onError={() => setImgErrors((prev) => ({ ...prev, [idx]: true }))}
            />
          ) : null}
          {/* Overlay with text */}
          <div className={`absolute inset-0 bg-gradient-to-r ${slide.bg} opacity-80`} />
          <div className="absolute inset-0 flex flex-col items-center justify-center text-center px-8">
            <p className={`text-xs sm:text-sm font-semibold uppercase tracking-widest mb-2 ${slide.accent}`}>
              ZENTEK EXCLUSIVE
            </p>
            <h2 className="font-display text-3xl sm:text-5xl font-black text-white mb-3 leading-tight">
              {slide.title}
            </h2>
            <p className="text-gray-200 text-base sm:text-xl mb-6 font-medium">{slide.subtitle}</p>
            <button className="bg-brand-red hover:bg-brand-red-dark text-white font-bold px-8 py-3 rounded-sm text-sm uppercase tracking-wider transition-colors">
              {slide.cta}
            </button>
          </div>
        </div>
      ))}

      {/* Navigation Arrows */}
      <button
        onClick={prev}
        className="absolute left-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronLeft className="w-5 h-5" />
      </button>
      <button
        onClick={next}
        className="absolute right-3 top-1/2 -translate-y-1/2 z-20 bg-black/40 hover:bg-black/60 text-white rounded-full p-2 transition-colors"
      >
        <ChevronRight className="w-5 h-5" />
      </button>

      {/* Dots */}
      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 flex gap-2">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrent(idx)}
            className={`rounded-full transition-all ${
              idx === current ? 'bg-white w-6 h-2' : 'bg-white/50 w-2 h-2'
            }`}
          />
        ))}
      </div>
    </div>
  );
}
