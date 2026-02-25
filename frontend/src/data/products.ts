export interface LocalProduct {
  id: string;
  name: string;
  imageUrl: string;
  price: number;
  mrp: number;
  description: string;
  tagline: string;
  keyFeatures: string[];
  codAvailable: boolean;
}

export const PRODUCTS: LocalProduct[] = [
  {
    id: '1',
    name: 'AuraBuds Pro',
    imageUrl: 'https://m.media-amazon.com/images/I/51f1YbJdQBL._AC_UF1000,1000_QL80_.jpg',
    price: 1999,
    mrp: 2999,
    description:
      'The AuraBuds Pro were built for people who refuse to blend in. Powerful active noise cancellation keeps distractions at bay while rich, bass-forward audio pulls you deep into whatever you\'re listening to. LED pulse rings react to your music in real time. Sweat-resistant with touch controls and a 30-hour combined battery.',
    tagline: '"Your sound. Your light. Your way."',
    keyFeatures: ['ANC (Active Noise Cancellation)', '30hr Battery Life', 'Touch Controls', 'IPX5 Water Resistant'],
    codAvailable: true,
  },
  {
    id: '2',
    name: 'NightDock',
    imageUrl: 'https://www.ultraprolink.com/cdn/shop/products/UM1006N.jpg?v=1754570585',
    price: 2499,
    mrp: 3999,
    description:
      'Charge your phone, earbuds, and smartwatch simultaneously with 15W fast charging. Features multiple RGB lighting modes, app control, and a built-in phone stand for a clean desk setup.',
    tagline: '"Charge everything. Light up the room."',
    keyFeatures: ['3-Device Charging', '16M RGB Lighting', '15W Fast Charge', 'Built-in Phone Stand'],
    codAvailable: true,
  },
  {
    id: '3',
    name: 'SnapGrip',
    imageUrl: 'https://dimensiva.com/wp-content/uploads/edd/2021/07/magsafe-battery-pack-by-apple-1024x1024.jpg',
    price: 999,
    mrp: 1499,
    description:
      'Provides a secure one-handed grip, doubles as a kickstand, and stores up to 3 cards. Compatible with MagSafe and most Android phones.',
    tagline: '"Less to carry. More control."',
    keyFeatures: ['Magnetic Lock', '3-Card Wallet', 'Kickstand', 'Ultra-Slim Design'],
    codAvailable: true,
  },
  {
    id: '4',
    name: 'HyperKey',
    imageUrl: 'https://images-cdn.ubuy.co.in/686d4ba05282f1edcc00aa03-magegee-mini-60-gaming-keyboard-rgb.jpg',
    price: 1799,
    mrp: 2599,
    description:
      'Connect up to 3 devices and switch instantly. Quiet tactile keys, backlit modes, and rechargeable battery make it perfect for students and professionals.',
    tagline: '"Pocket-sized. Full power."',
    keyFeatures: ['3-Device Bluetooth', 'Backlit Keys', 'Rechargeable Battery', 'Multi-OS Support'],
    codAvailable: true,
  },
  {
    id: '5',
    name: 'LumiCam',
    imageUrl: 'https://m.media-amazon.com/images/I/31l1nb1g-rS._AC_UF1000,1000_QL80_.jpg',
    price: 799,
    mrp: 1299,
    description:
      'Offers warm and cool tones, 3 brightness levels, USB-C charging, and a foldable design for easy portability.',
    tagline: '"Great light. Anywhere."',
    keyFeatures: ['3 Brightness Levels', 'Warm/Cool Tones', 'USB-C Charging', 'Foldable Design'],
    codAvailable: true,
  },
];

export function getProductById(id: string): LocalProduct | undefined {
  return PRODUCTS.find((p) => p.id === id);
}

export function calcDiscount(price: number, mrp: number): number {
  return Math.round(((mrp - price) / mrp) * 100);
}

export function formatPrice(amount: number): string {
  return `₹${amount.toLocaleString('en-IN')}`;
}
