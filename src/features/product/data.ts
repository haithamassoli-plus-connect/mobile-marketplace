import { img, sellers } from '@/features/home/data';

export const CURRENCY = 'JOD';

export type ProductColor = { name: string; hex: string };

export type ProductDetail = {
  id: string;
  seller: string;
  sellerAvatar: string;
  brand: string;
  title: string;
  currency: string;
  price: number;
  oldPrice: number;
  savePercent: number;
  rating: number;
  reviewCount: number;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
};

export type RatingBar = { stars: number; percent: number };

export type Review = {
  id: string;
  name: string;
  avatar: string;
  rating: number;
  date: string;
  verified: boolean;
  body: string;
  photos: string[];
  helpful: number;
};

export type RelatedProduct = {
  id: string;
  title: string;
  category: string;
  image: string;
  price: number;
  oldPrice: number;
};

export type Accordion = { id: string; title: string; body: string };

export const product: ProductDetail = {
  id: 'oversized-fleece-hoodie',
  seller: 'ShopVista',
  sellerAvatar: sellers[0].avatar,
  brand: 'CozyWear Studio',
  title: 'Oversized Fleece Hoodie',
  currency: CURRENCY,
  price: 44,
  oldPrice: 64,
  savePercent: 33,
  rating: 4.6,
  reviewCount: 128,
  gallery: [
    img('pdp-shirt-1', 720, 720),
    img('pdp-shirt-2', 720, 720),
    img('pdp-shirt-3', 720, 720),
    img('pdp-shirt-4', 720, 720),
    img('pdp-shirt-5', 720, 720),
  ],
  colors: [
    { name: 'Midnight Black', hex: '#181d27' },
    { name: 'Burgundy', hex: '#6b2737' },
    { name: 'Sand', hex: '#c9b79c' },
    { name: 'Navy', hex: '#2b3a55' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'],
};

export type SellerStat = { value: string; label: string };

export type SellerProfile = {
  name: string;
  avatar: string;
  verified: boolean;
  topRated: boolean;
  rating: number;
  ratingCount: string;
  stats: SellerStat[];
};

export const sellerProfile: SellerProfile = {
  name: product.seller,
  avatar: product.sellerAvatar,
  verified: true,
  topRated: true,
  rating: 4.8,
  ratingCount: '12,560',
  stats: [
    { value: '90', label: 'Sales' },
    { value: '1.2M', label: 'Followers' },
    { value: '2Y+', label: 'On GoldenTik' },
  ],
};

export const ratingHistogram: RatingBar[] = [
  { stars: 5, percent: 78 },
  { stars: 4, percent: 14 },
  { stars: 3, percent: 5 },
  { stars: 2, percent: 2 },
  { stars: 1, percent: 1 },
];

export const reviews: Review[] = [
  {
    id: 'rv1',
    name: 'Sarah J.',
    avatar: img('review-sarah', 120, 120),
    rating: 5,
    date: 'May 15, 2026',
    verified: true,
    body: 'Super soft and comfy. The oversized fit looks really nice and feels perfect for everyday wear.',
    photos: [img('review-shirt-1', 360, 360), img('review-shirt-2', 360, 360)],
    helpful: 12,
  },
  {
    id: 'rv2',
    name: 'Ahmad J.',
    avatar: img('review-ahmad', 120, 120),
    rating: 5,
    date: 'May 10, 2026',
    verified: true,
    body: 'Soft, simple, and perfect for casual outfits. The fit is exactly what I wanted.',
    photos: [img('review-shirt-3', 360, 360), img('review-shirt-4', 360, 360)],
    helpful: 8,
  },
];

export const relatedProducts: RelatedProduct[] = [
  { id: 'rel1', title: 'Essential Oversized Hoodie', category: 'Hoodies', image: img('rel-shirt-1', 360, 360), price: 42, oldPrice: 60 },
  { id: 'rel2', title: 'Cropped Zip-Up Hoodie', category: 'Hoodies', image: img('rel-shirt-2', 360, 360), price: 38, oldPrice: 52 },
  { id: 'rel3', title: 'Heavyweight Crewneck', category: 'Knitwear', image: img('rel-shirt-3', 360, 360), price: 45, oldPrice: 64 },
  { id: 'rel4', title: 'Cozy Fleece Joggers', category: 'Bottoms', image: img('rel-shirt-4', 360, 360), price: 35, oldPrice: 50 },
  { id: 'rel5', title: 'Relaxed Boxy Tee', category: 'Tops', image: img('rel-shirt-5', 360, 360), price: 18, oldPrice: 28 },
];

export const accordions: Accordion[] = [
  {
    id: 'about',
    title: 'About this product',
    body: 'Wrapped in plush midweight fleece, this oversized hoodie layers effortlessly over anything. A dropped shoulder and roomy double-lined hood give it that lived-in, borrowed-from-someone-cozier silhouette.',
  },
  {
    id: 'details',
    title: 'Product Details',
    body: '80% cotton, 20% recycled polyester brushed-back fleece (~480 gsm). Ribbed cuffs and hem, kangaroo pocket, and a double-lined hood. Model is 1.83m and wears size M.',
  },
  {
    id: 'care',
    title: 'Care & Confidence',
    body: 'Machine wash cold with like colours, tumble dry low, and skip ironing the print. Backed by a 30-day fit guarantee with free returns if the cosiness is not instant.',
  },
];

export type Coupon = { id: string; percent: number; caption: string; code: string; variant: 'gold' | 'green' | 'blue' | 'red' | 'dark' };

export const coupons: Coupon[] = [
  { id: 'c1', percent: 10, caption: 'Valid on first order', code: 'WELCOME10', variant: 'gold' },
  { id: 'c2', percent: 15, caption: 'Orders over JOD 50', code: 'SAVE15', variant: 'green' },
  { id: 'c3', percent: 20, caption: 'On selected items', code: 'DEAL20', variant: 'blue' },
  { id: 'c4', percent: 25, caption: 'Weekend only', code: 'WEEKEND25', variant: 'red' },
  { id: 'c5', percent: 30, caption: 'App exclusive', code: 'APP30', variant: 'dark' },
];

export type SizeSystem = { label: string; sizes: string[] };

export type SizeGuide = {
  columns: string[];
  systems: SizeSystem[];
  rows: number[][]; // measurements in CM, aligned by index to each system’s sizes
  howToMeasure: string[];
  fitNote?: string;
};

export const sizeGuides: Record<string, SizeGuide> = {
  hoodie: {
    columns: ['Chest', 'Length', 'Sleeve'],
    systems: [
      { label: 'International (XS–XXL)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { label: 'US (0–20)', sizes: ['0', '4', '8', '12', '16', '20'] },
      { label: 'EU (40–50)', sizes: ['40', '42', '44', '46', '48', '50'] },
    ],
    rows: [[106, 66, 58], [110, 68, 59], [114, 70, 60], [118, 72, 61], [122, 74, 62], [126, 76, 63]],
    howToMeasure: [
      'Chest — measure around the fullest part, under the arms.',
      'Length — from the highest shoulder point down to the hem.',
      'Sleeve — from the shoulder seam to the cuff.',
    ],
    fitNote: 'This style runs oversized — size down for a regular fit.',
  },
  tshirt: {
    columns: ['Chest', 'Length', 'Sleeve'],
    systems: [
      { label: 'International (XS–XXL)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { label: 'US (0–20)', sizes: ['0', '4', '8', '12', '16', '20'] },
    ],
    rows: [[92, 66, 20], [96, 68, 21], [100, 70, 22], [104, 72, 23], [108, 74, 24], [112, 76, 25]],
    howToMeasure: [
      'Chest — measure around the fullest part, under the arms.',
      'Length — from the highest shoulder point down to the hem.',
      'Sleeve — from the shoulder seam to the sleeve hem.',
    ],
    fitNote: 'Regular fit — true to size.',
  },
  jeans: {
    columns: ['Waist', 'Hip', 'Inseam'],
    systems: [
      { label: 'International (XS–XXL)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { label: 'Waist (in)', sizes: ['28', '30', '32', '34', '36', '38'] },
      { label: 'EU (36–46)', sizes: ['36', '38', '40', '42', '44', '46'] },
    ],
    rows: [[71, 91, 78], [76, 96, 79], [81, 101, 80], [86, 106, 81], [91, 111, 82], [96, 116, 82]],
    howToMeasure: [
      'Waist — measure around your natural waistline.',
      'Hip — measure around the fullest part of your hips.',
      'Inseam — from the crotch seam down to the hem.',
    ],
    fitNote: 'Slim fit — size up if you prefer a relaxed leg.',
  },
  dress: {
    columns: ['Bust', 'Waist', 'Length'],
    systems: [
      { label: 'International (XS–XXL)', sizes: ['XS', 'S', 'M', 'L', 'XL', 'XXL'] },
      { label: 'US (0–20)', sizes: ['0', '4', '8', '12', '16', '20'] },
      { label: 'UK (4–24)', sizes: ['4', '8', '12', '16', '20', '24'] },
    ],
    rows: [[82, 64, 88], [86, 68, 90], [90, 72, 92], [94, 76, 94], [98, 80, 96], [102, 84, 98]],
    howToMeasure: [
      'Bust — measure around the fullest part of your bust.',
      'Waist — measure around your natural waistline.',
      'Length — from the shoulder seam down to the hem.',
    ],
    fitNote: 'Designed for a regular fit — fully lined.',
  },
};
