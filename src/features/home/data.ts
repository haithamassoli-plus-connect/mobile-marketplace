// Static dummy data for the marketplace home screen.
// Images use Lorem Picsum with stable seeds (https://picsum.photos/seed/<seed>/<w>/<h>).
// ponytail: hardcoded content — replace with React Query hooks when a backend exists.

import type { IconName } from './components/icon';

function img(seed: string, w: number, h: number) {
  return `https://picsum.photos/seed/${seed}/${w}/${h}`;
}

export type Product = {
  id: string;
  title: string;
  image: string;
  price: number;
  oldPrice?: number;
  badge?: string;
  badgeTone?: 'dark' | 'gold';
  rating?: number;
};

/* ---------------------------------- Navbar --------------------------------- */
export const nav = {
  locale: 'En / JOD',
  wishlistCount: 2,
  searchPlaceholder: 'Search for products, brands, or categories',
  tagline: 'Everything you need in one place',
};

/* -------------------------------- Wishlist --------------------------------- */
export type WishlistItem = {
  id: string;
  title: string;
  image: string;
  category: string; // "Watches · Aurelius"
  price: number;
  oldPrice?: number;
  priceDropped?: boolean; // green "Price dropped" pill w/ trending-down icon
  stockBadge?: { label: string; tone: 'success' | 'error' }; // "Only 3 left"
  meta?: string; // trailing note next to the cart button, e.g. "In stock", "★ 4.8"
  metaTone?: 'success' | 'muted';
};
export const wishlist: WishlistItem[] = [
  {
    id: 'wl1',
    title: 'Heritage Watch',
    image: img('tr-watch', 360, 360),
    category: 'Watches · Aurelius',
    price: 249,
    oldPrice: 399,
    priceDropped: true,
    meta: 'In stock',
    metaTone: 'success',
  },
  {
    id: 'wl2',
    title: 'Aviator Shades',
    image: img('tr-shades', 360, 360),
    category: 'Eyewear · SunCo',
    price: 95,
    stockBadge: { label: 'Only 3 left', tone: 'error' },
    meta: '★ 4.8',
    metaTone: 'muted',
  },
];

/* --------------------------------- Stories --------------------------------- */
export type Story = { id: string; label: string; image: string; live?: boolean };
export const stories: Story[] = [
  { id: 'st1', label: 'MarketMingle', image: img('story-mingle', 200, 200), live: true },
  { id: 'st2', label: 'PurchasePalace', image: img('story-palace', 200, 200) },
  { id: 'st3', label: 'SalesSanctuary', image: img('story-sanctuary', 200, 200) },
  { id: 'st4', label: 'MerchantMeadow', image: img('story-meadow', 200, 200) },
  { id: 'st5', label: 'RetailRealm', image: img('story-realm', 200, 200) },
  { id: 'st6', label: 'CommerceCorner', image: img('story-corner', 200, 200) },
  { id: 'st7', label: 'BazaarBuddy', image: img('story-bazaar', 200, 200) },
  { id: 'st8', label: 'DealDome', image: img('story-dome', 200, 200) },
  { id: 'st9', label: 'TradeTrove', image: img('story-trove', 200, 200) },
  { id: 'st10', label: 'ShopSphere', image: img('story-sphere', 200, 200) },
];

/* ---------------------------- Featured hero rail --------------------------- */
export type Featured = {
  id: string;
  brand: string;
  title: string;
  description: string;
  image: string;
  discount: string;
};
export const featured: Featured[] = [
  {
    id: 'f1',
    brand: 'All Stars',
    title: 'Classic feet comfort wearing',
    description:
      'Featuring 12 versatile shades that transition from satin to shimmer, perfect for a stunning look every day.',
    image: img('feature-sneaker', 720, 860),
    discount: '20% OFF',
  },
  {
    id: 'f2',
    brand: 'Ray-ban',
    title: 'Radiant Glow Eyeshadow',
    description:
      '12 versatile shades featuring a satin-to-shimmer finish for a seamless daily radiance.',
    image: img('feature-shades', 720, 860),
    discount: '20% OFF',
  },
  {
    id: 'f3',
    brand: 'LUMIÈRE',
    title: 'Pro Glow Eyeshadow Palette',
    description:
      '12 buildable shades with a satin-to-shimmer finish for an effortless everyday glow.',
    image: img('feature-palette', 720, 860),
    discount: '20% OFF',
  },
  {
    id: 'f4',
    brand: 'Apple',
    title: 'All you need in one laptop',
    description:
      'Showcasing 12 dynamic hues that effortlessly shift from matte to metallic.',
    image: img('feature-laptop', 720, 860),
    discount: '20% OFF',
  },
];

/* ------------------------------ Trending grid ------------------------------ */
export type TrendingItem = {
  id: string;
  title: string;
  subtitle?: string;
  image: string;
};
export const trending: { featured: TrendingItem; items: TrendingItem[] } = {
  featured: {
    id: 't1',
    title: 'The Splendor Drop',
    subtitle: 'Editorial · 24 pieces',
    image: img('trend-editorial', 560, 700),
  },
  items: [
    { id: 't2', title: 'Vintage analog', subtitle: 'Watches', image: img('trend-watch', 400, 400) },
    { id: 't3', title: 'Everyday bag', subtitle: 'Accessories', image: img('trend-bag', 400, 400) },
  ],
};

/* -------------------------------- Live video ------------------------------- */
export const live = {
  badge: 'LIVE',
  title: 'Summer Style Edit — shop the looks',
  host: 'Bella Moda',
  viewers: '2.4K watching',
  image: img('live-stream', 760, 1100),
  products: [
    { id: 'lp1', title: 'Linen Shirt', image: img('live-shirt', 200, 200), price: 59 },
    { id: 'lp2', title: 'Straw Hat', image: img('live-hat', 200, 200), price: 39 },
    { id: 'lp3', title: 'Canvas Tote', image: img('live-tote', 200, 200), price: 49 },
  ],
};

/* ----------------------- Promo banner (flash deals) ------------------------ */
export const countdown = { days: '02', hours: '08', minutes: '45', seconds: '12' };
export const promo = {
  eyebrow: 'HURRY — OFFER ENDS SOON',
  headline: 'Get an extra 15% off your order',
  cta: 'Claim my discount',
  dismiss: 'No thanks, I’ll pay full price',
};
export const flashDeals: Product[] = [
  { id: 'fd1', title: 'Rose Gold Minimal Watch', image: img('flash-watch', 360, 360), price: 129, oldPrice: 259, badge: '-50%', badgeTone: 'dark' },
  { id: 'fd2', title: 'Designer Leather Bag', image: img('flash-bag', 360, 360), price: 199, oldPrice: 399, badge: '-50%', badgeTone: 'dark' },
  { id: 'fd3', title: 'Premium Running Shoes', image: img('flash-shoe', 360, 360), price: 149, oldPrice: 249, badge: '-40%', badgeTone: 'dark' },
  { id: 'fd4', title: 'Smart Watch Series X', image: img('flash-smart', 360, 360), price: 179, oldPrice: 299, badge: '-40%', badgeTone: 'dark' },
];

/* ----------------------------- Product rails ------------------------------- */
export const bestSellers: Product[] = [
  { id: 'bs1', title: 'Aviator Watch', image: img('bs-watch', 360, 360), price: 199, oldPrice: 399, badge: '-30%', badgeTone: 'dark' },
  { id: 'bs2', title: 'Smart Fitness Band', image: img('bs-band', 360, 360), price: 89, oldPrice: 129, badge: '-30%', badgeTone: 'dark' },
  { id: 'bs3', title: 'Leather Crossbody', image: img('bs-bag', 360, 360), price: 149 },
  { id: 'bs4', title: 'Wireless Earbuds', image: img('bs-earbuds', 360, 360), price: 79, oldPrice: 99 },
  { id: 'bs5', title: 'Classic Sunglasses', image: img('bs-shades', 360, 360), price: 95 },
];
export const topRated: Product[] = [
  { id: 'tr1', title: 'Heritage Watch', image: img('tr-watch', 360, 360), price: 249, rating: 4.9 },
  { id: 'tr2', title: 'Cobalt Tote', image: img('tr-tote', 360, 360), price: 189, rating: 4.8 },
  { id: 'tr3', title: 'Trail Sneaker', image: img('tr-sneaker', 360, 360), price: 119, rating: 4.7 },
  { id: 'tr4', title: 'Aviator Shades', image: img('tr-shades', 360, 360), price: 95, rating: 4.8 },
  { id: 'tr5', title: 'Minimal Backpack', image: img('tr-backpack', 360, 360), price: 139, rating: 4.9 },
];

/* -------------------------------- Discover --------------------------------- */
export const discover = {
  eyebrow: 'DISCOVER',
  title: 'Discover',
  subtitle: 'Curated picks for you and the freshest drops.',
  tabs: ['For you', 'New arrivals'],
  featured: {
    title: 'Velocity Runner',
    reason: 'Because you love sneakers',
    image: img('disc-runner', 360, 360),
    price: 129,
    rating: 4.8,
  },
  categories: ['Sneakers', 'Watches', 'Bags', 'Eyewear'],
  recommended: [
    { id: 'rc1', title: 'Heritage Watch', image: img('tr-watch', 360, 360), price: 249, badge: 'FOR YOU', badgeTone: 'gold' },
    { id: 'rc2', title: 'Aviator Shades', image: img('tr-shades', 360, 360), price: 95, badge: 'FOR YOU', badgeTone: 'gold' },
    { id: 'rc3', title: 'Cobalt Tote', image: img('tr-tote', 360, 360), price: 189, badge: 'FOR YOU', badgeTone: 'gold' },
    { id: 'rc4', title: 'Trail Sneaker', image: img('tr-sneaker', 360, 360), price: 119, badge: 'FOR YOU', badgeTone: 'gold' },
  ] as Product[],
};

/* ----------------------------- Trusted brands ------------------------------ */
export type Brand = { id: string; name: string; logo: string };
export const trustedBrands = {
  title: 'Trusted Brands',
  subtitle: 'Discover 100+ top brands you can trust.',
  brands: [
    { id: 'br1', name: 'Apple', logo: img('brand-apple', 200, 120) },
    { id: 'br2', name: 'Nike', logo: img('brand-nike', 200, 120) },
    { id: 'br3', name: 'Sony', logo: img('brand-sony', 200, 120) },
    { id: 'br4', name: 'Adidas', logo: img('brand-adidas', 200, 120) },
    { id: 'br5', name: 'Samsung', logo: img('brand-samsung', 200, 120) },
    { id: 'br6', name: 'Gucci', logo: img('brand-gucci', 200, 120) },
    { id: 'br7', name: 'Dyson', logo: img('brand-dyson', 200, 120) },
    { id: 'br8', name: 'Bose', logo: img('brand-bose', 200, 120) },
  ] as Brand[],
};

/* ----------------------------- Verified sellers ---------------------------- */
export type Seller = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  reviews: string;
  category: string;
  products: string[];
};
export const sellers: Seller[] = [
  {
    id: 'sl1',
    name: 'Luxe Avenue',
    avatar: img('seller-luxe', 120, 120),
    rating: 4.9,
    reviews: '12.4K',
    category: 'Accessories',
    products: ['lx1', 'lx2', 'lx3', 'lx4'].map(s => img(s, 300, 300)),
  },
  {
    id: 'sl2',
    name: 'TechZone Pro',
    avatar: img('seller-tech', 120, 120),
    rating: 4.8,
    reviews: '8.7K',
    category: 'Electronics',
    products: ['tz1', 'tz2', 'tz3', 'tz4'].map(s => img(s, 300, 300)),
  },
  {
    id: 'sl3',
    name: 'Bella Moda',
    avatar: img('seller-bella', 120, 120),
    rating: 4.7,
    reviews: '23.1K',
    category: 'Women’s Fashion',
    products: ['bm1', 'bm2', 'bm3', 'bm4'].map(s => img(s, 300, 300)),
  },
  {
    id: 'sl4',
    name: 'Sneaker Hub',
    avatar: img('seller-sneaker', 120, 120),
    rating: 4.9,
    reviews: '31.5K',
    category: 'Footwear',
    products: ['sh1', 'sh2', 'sh3', 'sh4'].map(s => img(s, 300, 300)),
  },
];

/* ------------------------------- Seller CTA -------------------------------- */
export const sellerCta = {
  eyebrow: 'Golden Tik Market',
  title: 'Start selling on the marketplace',
  description:
    'Join thousands of sellers reaching millions of buyers across the region — with zero listing fees for your first 3 months.',
  cta: 'Become a seller',
  props: [
    { icon: 'users' as IconName, label: 'Reach 2M+ active buyers' },
    { icon: 'badge-dollar-sign' as IconName, label: 'Zero listing fees for 3 months' },
    { icon: 'briefcase-business' as IconName, label: 'Join 50K+ verified sellers' },
  ],
};
