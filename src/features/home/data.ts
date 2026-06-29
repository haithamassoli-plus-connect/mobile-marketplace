// Static dummy data for the marketplace home screen.
// Images via LoremFlickr — real keyword-matched photos, free, no API key:
//   https://loremflickr.com/<w>/<h>/<keyword>?lock=<n>
// Each seed encodes its subject; we map it to a search keyword and hash it to a
// stable `lock` so every item keeps the same photo across reloads.
// ponytail: hardcoded content — replace with React Query hooks when a backend exists.

import type { IconName } from './components/icon';

// Real product photos from DummyJSON (free, no key) — clean white-bg shots:
//   https://cdn.dummyjson.com/product-images/<category>/<slug>/thumbnail.webp
// token → [category, ...slugs]; the seed hash picks a slug so product rails stay varied.
const PRODUCT: Record<string, [string, string, ...string[]]> = {
  watch: ['mens-watches', 'longines-master-collection', 'rolex-datejust', 'rolex-cellini-moonphase', 'brown-leather-belt-watch'],
  smart: ['mens-watches', 'rolex-cellini-date-black-dial', 'rolex-datejust'],
  band: ['mens-watches', 'brown-leather-belt-watch', 'longines-master-collection'],
  bag: ['womens-bags', 'prada-women-bag', 'women-handbag-black', 'white-faux-leather-backpack'],
  tote: ['womens-bags', 'women-handbag-black', 'prada-women-bag'],
  handbag: ['womens-bags', 'prada-women-bag', 'women-handbag-black'],
  backpack: ['womens-bags', 'white-faux-leather-backpack', 'women-handbag-black'],
  luxe: ['womens-bags', 'prada-women-bag', 'women-handbag-black'],
  lx: ['womens-bags', 'prada-women-bag', 'women-handbag-black', 'white-faux-leather-backpack'],
  sneaker: ['mens-shoes', 'nike-air-jordan-1-red-and-black', 'puma-future-rider-trainers', 'sports-sneakers-off-white-red'],
  sneakers: ['mens-shoes', 'nike-air-jordan-1-red-and-black', 'puma-future-rider-trainers', 'sports-sneakers-off-white-red'],
  shoe: ['mens-shoes', 'puma-future-rider-trainers', 'nike-air-jordan-1-red-and-black'],
  sh: ['mens-shoes', 'nike-air-jordan-1-red-and-black', 'puma-future-rider-trainers', 'sports-sneakers-off-white-red'],
  loafer: ['mens-shoes', 'puma-future-rider-trainers', 'nike-air-jordan-1-red-and-black'],
  runner: ['mens-shoes', 'sports-sneakers-off-white-red', 'nike-air-jordan-1-red-and-black'],
  shades: ['sunglasses', 'classic-sun-glasses', 'black-sun-glasses', 'green-and-black-glasses'],
  laptop: ['laptops', 'apple-macbook-pro-14-inch-space-grey', 'asus-zenbook-pro-dual-screen-laptop', 'lenovo-yoga-920'],
  earbuds: ['mobile-accessories', 'apple-airpods', 'apple-airpods-max-silver'],
  headphones: ['mobile-accessories', 'apple-airpods-max-silver', 'apple-airpods'],
  tz: ['mobile-accessories', 'apple-airpods', 'apple-airpods-max-silver', 'amazon-echo-plus'],
  palette: ['beauty', 'eyeshadow-palette-with-mirror', 'powder-canister'],
  cushion: ['home-decoration', 'table-lamp', 'plant-pot', 'house-showpiece-plant'],
  dress: ['womens-dresses', 'corset-leather-with-skirt', 'corset-with-black-skirt', 'dress-pea'],
  bella: ['womens-dresses', 'dress-pea', 'corset-with-black-skirt'],
  bm: ['womens-dresses', 'corset-leather-with-skirt', 'dress-pea', 'corset-with-black-skirt'],
  jewelry: ['womens-jewellery', 'green-crystal-earring', 'green-oval-earring', 'tropical-earring'],
  skincare: ['skin-care', 'olay-ultra-moisture-shea-butter-body-wash', 'vaseline-men-body-and-face-lotion'],
  shirt: ['mens-shirts', 'man-plaid-shirt', 'man-short-sleeve-shirt', 'men-check-shirt', 'blue-&-black-check-shirt', 'gigabyte-aorus-men-tshirt'],
  tech: ['smartphones', 'iphone-13-pro', 'iphone-x', 'oppo-a57'],
};

// Story / seller full-screen covers aren't products → LoremFlickr store scenes
// (https://loremflickr.com/<w>/<h>/<kw>?lock=<n>). token → search; comma = multiple tags.
const KEYWORD: Record<string, string> = {
  stream: 'fashion,model', editorial: 'fashion',
  mingle: 'boutique', palace: 'storefront', sanctuary: 'jewelry,store',
  meadow: 'fashion,store', realm: 'sneaker,store', corner: 'handbag,store',
  bazaar: 'market', dome: 'shopping,mall', trove: 'vintage,store', sphere: 'electronics,store',
};
// Seed prefixes/suffixes that aren't subjects (tr-watch, story-mingle, mingle-f1…).
const SKIP = new Set(['tr', 'bs', 'flash', 'feature', 'live', 'trend', 'disc', 'na', 'brand', 'seller', 'story', 'sd', 'f']);

// The subject token of a seed: 'tr-watch' → 'watch', 'mingle-f1' → 'mingle'.
function token(seed: string) {
  const tokens = seed.split(/[-\d]+/).filter(Boolean);
  return tokens.reverse().find(t => !SKIP.has(t)) ?? 'product';
}

// Deterministic 1–1000 lock from the full seed → stable, distinct images.
function lock(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) h = (h * 31 + seed.charCodeAt(i)) >>> 0;
  return (h % 1000) + 1;
}

export function img(seed: string, w: number, h: number) {
  const t = token(seed);
  const product = PRODUCT[t];
  if (product) {
    const [category, ...slugs] = product;
    const slug = slugs[lock(seed) % slugs.length];
    return `https://cdn.dummyjson.com/product-images/${category}/${slug}/thumbnail.webp`;
  }
  return `https://loremflickr.com/${w}/${h}/${KEYWORD[t] ?? t}?lock=${lock(seed)}`;
}

// Real brand logos via Clearbit (free, no key): https://logo.clearbit.com/<domain>.
const BRAND_DOMAIN: Record<string, string> = {
  Apple: 'apple.com', Nike: 'nike.com', Sony: 'sony.com', Adidas: 'adidas.com',
  Samsung: 'samsung.com', Gucci: 'gucci.com', Dyson: 'dyson.com', Bose: 'bose.com',
};
function logo(name: string) {
  return `https://logo.clearbit.com/${BRAND_DOMAIN[name] ?? `${name.toLowerCase()}.com`}`;
}

// n distinct full-screen covers (1080×1920 portrait) derived from one seed — the
// per-store frames shown in the story viewer. ponytail: derived inline, no backend.
function frames(seed: string, n: number) {
  return Array.from({ length: n }, (_, i) => img(`${seed}-f${i + 1}`, 1080, 1920));
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
  timeAgo?: string; // dark "4h ago" pill on the image corner (new arrivals)
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
export type StoryTag = 'live' | 'new' | 'hot';
export type Story = {
  id: string;
  label: string;
  image: string; // 200px avatar — used by StoriesRow (unchanged)
  tag?: StoryTag;
  discount?: string; // hot: red discount pill, e.g. '-40%'
  endsInSec?: number; // hot: countdown shown as "Ends in MM:SS"
  watching?: string; // live: e.g. '1.2k' → "1.2k watching"
  viewed?: boolean;
  frames: string[]; // 3–5 full-screen covers for the viewer (one segment each)
};
export const stories: Story[] = [
  { id: 'st1', label: 'MarketMingle', image: img('story-mingle', 200, 200), tag: 'live', watching: '1.2k', frames: frames('mingle', 4) },
  { id: 'st2', label: 'PurchasePalace', image: img('story-palace', 200, 200), tag: 'new', frames: frames('palace', 3) },
  { id: 'st3', label: 'SalesSanctuary', image: img('story-sanctuary', 200, 200), tag: 'hot', discount: '-40%', endsInSec: 134, frames: frames('sanctuary', 5) },
  { id: 'st4', label: 'MerchantMeadow', image: img('story-meadow', 200, 200), frames: frames('meadow', 3) },
  { id: 'st5', label: 'RetailRealm', image: img('story-realm', 200, 200), frames: frames('realm', 4) },
  { id: 'st6', label: 'CommerceCorner', image: img('story-corner', 200, 200), frames: frames('corner', 3) },
  { id: 'st7', label: 'BazaarBuddy', image: img('story-bazaar', 200, 200), frames: frames('bazaar', 5) },
  { id: 'st8', label: 'DealDome', image: img('story-dome', 200, 200), viewed: true, frames: frames('dome', 3) },
  { id: 'st9', label: 'TradeTrove', image: img('story-trove', 200, 200), viewed: true, frames: frames('trove', 4) },
  { id: 'st10', label: 'ShopSphere', image: img('story-sphere', 200, 200), viewed: true, frames: frames('sphere', 3) },
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
  count: '23.6K', // shown in the top badge: "LIVE · 23.6K"
  host: 'Urban Sole',
  image: img('live-stream', 760, 1100),
  // Featured-products sheet (Figma 170:4036) — price/badge populate the cards.
  products: [
    { id: 'lp1', title: 'Linen Shirt', image: img('live-shirt', 360, 360), price: 59, oldPrice: 89, badge: '-33%' },
    { id: 'lp2', title: 'Straw Hat', image: img('live-hat', 360, 360), price: 39, oldPrice: 59, badge: '-34%' },
    { id: 'lp3', title: 'Canvas Tote', image: img('live-tote', 360, 360), price: 49, oldPrice: 79, badge: '-38%' },
    { id: 'lp4', title: 'Suede Loafers', image: img('live-loafer', 360, 360), price: 119, oldPrice: 199, badge: '-40%' },
  ] as Product[],
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
  eyebrow: 'Products made for you',
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
    { id: 'rc1', title: 'Heritage Watch', image: img('tr-watch', 360, 360), price: 249 },
    { id: 'rc2', title: 'Aviator Shades', image: img('tr-shades', 360, 360), price: 95 },
    { id: 'rc3', title: 'Cobalt Tote', image: img('tr-tote', 360, 360), price: 189 },
    { id: 'rc4', title: 'Trail Sneaker', image: img('tr-sneaker', 360, 360), price: 119 },
  ] as Product[],
  // New arrivals tab — "Just Dropped" hero + "Fresh this week" grid (New badge + time-ago).
  newArrivals: {
    hero: { image: img('disc-runner', 720, 520), timeAgo: '2h ago' },
    items: [
      { id: 'na1', title: 'Aviator Watch', image: img('bs-watch', 360, 360), price: 199, badge: 'New', badgeTone: 'dark' },
      { id: 'na2', title: 'Cobalt Tote', image: img('tr-tote', 360, 360), price: 189, badge: 'New', badgeTone: 'dark', timeAgo: '4h ago' },
      { id: 'na3', title: 'Aviator Shades', image: img('tr-shades', 360, 360), price: 95, badge: 'New', badgeTone: 'dark', timeAgo: '1d ago' },
      { id: 'na4', title: 'Trail Sneaker', image: img('tr-sneaker', 360, 360), price: 119, badge: 'New', badgeTone: 'dark', timeAgo: '2d ago' },
      { id: 'na5', title: 'Heritage Watch', image: img('tr-watch', 360, 360), price: 249, badge: 'New', badgeTone: 'dark', timeAgo: '3d ago' },
      { id: 'na6', title: 'Linen Cushion', image: img('na-cushion', 360, 360), price: 45, badge: 'New', badgeTone: 'dark', timeAgo: '5d ago' },
    ] as Product[],
  },
};

/* ----------------------------- Trusted brands ------------------------------ */
export type Brand = { id: string; name: string; logo: string };
export const trustedBrands = {
  title: 'Trusted Brands',
  subtitle: 'Discover 100+ top brands you can trust.',
  brands: [
    { id: 'br1', name: 'Apple', logo: logo('Apple') },
    { id: 'br2', name: 'Nike', logo: logo('Nike') },
    { id: 'br3', name: 'Sony', logo: logo('Sony') },
    { id: 'br4', name: 'Adidas', logo: logo('Adidas') },
    { id: 'br5', name: 'Samsung', logo: logo('Samsung') },
    { id: 'br6', name: 'Gucci', logo: logo('Gucci') },
    { id: 'br7', name: 'Dyson', logo: logo('Dyson') },
    { id: 'br8', name: 'Bose', logo: logo('Bose') },
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
