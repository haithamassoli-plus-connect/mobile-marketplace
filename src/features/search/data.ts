// Static dummy data for the search discovery screen (Figma 610:1555).
// ponytail: hardcoded — swap for React Query hooks when a backend exists.
import type { IconName } from '@/features/home/components/icon';

function img(seed: string) {
  return `https://picsum.photos/seed/${seed}/80/80`;
}

export const searchPlaceholder = 'Search for products, brands, or categories';

export const categoryTabs = [
  'All',
  'Fashion',
  'Electronics',
  'Beauty',
  'Home',
  'Sports',
  'Kids',
  'Gifts',
] as const;

// Colored explore cards (3 rows × 2). Each tone keys a tailwind class set below.
export type ExploreCard = {
  title: string;
  subtitle: string;
  icon: IconName;
  tone: 'error' | 'primary' | 'information' | 'success' | 'secondary' | 'neutral';
};
export const exploreCards: ExploreCard[] = [
  { title: 'Flash Sale', subtitle: 'Up to 70% off', icon: 'zap', tone: 'error' },
  { title: 'Gift Packages', subtitle: 'Ready to send', icon: 'gift', tone: 'primary' },
  { title: 'Bundles & Combos', subtitle: 'Save more together', icon: 'package', tone: 'information' },
  { title: 'Coupons', subtitle: 'Apply & save', icon: 'ticket', tone: 'success' },
  { title: 'Trending products', subtitle: 'Final markdowns', icon: 'tag', tone: 'secondary' },
  { title: 'New In', subtitle: 'Just landed', icon: 'sparkles', tone: 'neutral' },
];

// tone → [card bg, card border, icon circle bg, icon color]
export const exploreTone: Record<ExploreCard['tone'], [string, string, string, string]> = {
  error: ['bg-error-50', 'border-error-200', 'bg-error-100', '#d92d20'],
  primary: ['bg-primary-50', 'border-primary-200', 'bg-primary-100', '#b8941f'],
  information: ['bg-information-50', 'border-information-200', 'bg-information-100', '#1570ef'],
  success: ['bg-success-50', 'border-success-200', 'bg-success-100', '#039855'],
  secondary: ['bg-secondary-50', 'border-secondary-200', 'bg-secondary-100', '#475569'],
  neutral: ['bg-white', 'border-neutral-200', 'bg-neutral-100', '#535862'],
};

export const discoveryPills = [
  { label: 'Men\'s sneakers', image: img('sd-sneakers') },
  { label: 'Smart watches', image: img('sd-watch') },
  { label: 'Wireless headphones', image: img('sd-headphones') },
  { label: 'Designer sunglasses', image: img('sd-shades') },
  { label: 'Handbags', image: img('sd-bag') },
  { label: 'Summer dresses', image: img('sd-dress') },
  { label: 'Gold jewelry', image: img('sd-jewelry') },
  { label: 'Skincare sets', image: img('sd-skincare') },
];

export const recentSearches = [
  'wireless earbuds',
  'men\'s running shoes',
  'gold watch',
  'leather wallet',
  'sunglasses',
  'denim jacket',
];

export const trendingSearches = [
  'Summer Dresses',
  'Men\'s Sneakers',
  'Smart Watches',
  'Wireless Earbuds',
  'Designer Handbags',
  'Gold Jewelry',
  'Kids\' Toys',
  'Skincare Sets',
  'Home Decor',
];
