import type { ReactNode } from 'react';
import type { Product } from '../data';
import type { IconName } from './icon';

import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from './icon';

// Shared building blocks reused across home sections.
// ponytail: plain props, no theming layer — gold/ink come straight from tokens.

/* -------------------------------- IconButton ------------------------------- */
// White circular action (e.g. wishlist heart) with a soft Figma "Buttons Shadow".
export function IconButton({
  name,
  size = 18,
  color = '#181d27',
  className = 'bg-white',
}: {
  name: IconName;
  size?: number;
  color?: string;
  className?: string;
}) {
  return (
    <Pressable
      className={`size-[34px] items-center justify-center rounded-full shadow-sm ${className}`}
    >
      <Icon name={name} size={size} color={color} />
    </Pressable>
  );
}

/* ----------------------------------- Chip ---------------------------------- */
export function Chip({ label, active = false }: { label: string; active?: boolean }) {
  return (
    <View
      className={`rounded-full border px-3.5 py-1.5 ${
        active ? 'border-gold-500 bg-gold-500' : 'border-neutral-300 bg-white'
      }`}
    >
      <Text
        variant="footnote"
        emphasized
        className={active ? 'text-ink-950' : 'text-ink-800'}
      >
        {label}
      </Text>
    </View>
  );
}

/* --------------------------------- Rating ---------------------------------- */
export function Rating({ value }: { value: number }) {
  return (
    <View className="flex-row items-center gap-1">
      <Icon name="star" size={12} color="#DBB42C" />
      <Text variant="caption-1" emphasized className="text-ink-800">
        {value.toFixed(1)}
      </Text>
    </View>
  );
}

/* ------------------------------ SectionHeader ------------------------------ */
// Leading gold icon + title (Title 3 Emphasized), white-bordered "Shop Now"
// pill on the right, and a muted subheadline subtitle below.
export function SectionHeader({
  title,
  subtitle,
  icon,
  actionLabel,
  className = '',
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  actionLabel?: string;
  className?: string;
}) {
  return (
    <View className={`gap-2 px-4 ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-1.5">
          {icon ? <Icon name={icon} size={20} color="#DBB42C" /> : null}
          <Text variant="title-3" emphasized className="text-ink-900">{title}</Text>
        </View>
        {actionLabel
          ? (
              <Pressable className="flex-row items-center gap-1.5 rounded-xl border border-neutral-300 bg-white py-[11px] pr-[18px] pl-5">
                <Text variant="footnote" emphasized className="text-ink-900">{actionLabel}</Text>
                <Icon name="arrow-right" size={14} color="#020617" />
              </Pressable>
            )
          : null}
      </View>
      {subtitle ? <Text variant="subheadline" className="text-neutral-600">{subtitle}</Text> : null}
    </View>
  );
}

/* ---------------------------------- Badge ---------------------------------- */
// ponytail: #1a1a2e is the exact Figma badge navy — no token matches it.
export function ProductBadge({
  label,
  tone = 'dark',
}: {
  label: string;
  tone?: 'dark' | 'gold';
}) {
  return (
    <View
      className={`rounded-full px-2 py-[3px] ${tone === 'gold' ? 'bg-gold-500' : 'bg-[#1a1a2e]'}`}
    >
      <Text variant="caption-2" emphasized className="text-white">{label}</Text>
    </View>
  );
}

/* ------------------------------- ProductCard ------------------------------- */
// Fills its parent width. Wrap in a fixed-width View (rails) or flex-1 (grids).
export function ProductCard({ product }: { product: Product }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/product', params: { id: product.id } })}
      className="w-full gap-2.5 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-2 pt-2 pb-3 shadow-md"
    >
      <View className="relative h-[149px] overflow-hidden rounded-xl">
        <Image source={product.image} className="size-full" contentFit="cover" />
        {product.badge
          ? (
              <View className="absolute top-2 left-2">
                <ProductBadge label={product.badge} tone={product.badgeTone} />
              </View>
            )
          : null}
        <IconButton name="heart" size={18} className="absolute top-2 right-2 bg-white" />
        {product.timeAgo
          ? (
              <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-xl bg-[#1a1a2e] px-1.5 py-1">
                <Icon name="clock" size={11} color="#FFFFFF" />
                <Text variant="caption-2" emphasized className="text-white">{product.timeAgo}</Text>
              </View>
            )
          : null}
      </View>

      <View className="gap-1">
        <Text numberOfLines={1} variant="subheadline" emphasized className="text-ink-900">
          {product.title}
        </Text>
        {product.rating ? <Rating value={product.rating} /> : null}
        <View className="flex-row items-baseline gap-1.5">
          <Text variant="headline" className="text-gold-500">{`$ ${product.price}`}</Text>
          {product.oldPrice
            ? (
                <Text variant="caption-1" className="text-neutral-500 line-through">{`$ ${product.oldPrice}`}</Text>
              )
            : null}
        </View>
      </View>

      <Pressable className="h-[42px] items-center justify-center rounded-xl bg-gold-500">
        <Text variant="footnote" emphasized className="text-ink-950">Add to cart</Text>
      </Pressable>
    </Pressable>
  );
}

/* ------------------------------- ProductRail ------------------------------- */
// Section header + horizontal scroll of ProductCards. Used by Best Seller & Top Rated.
export function ProductRail({
  title,
  subtitle,
  icon,
  products,
  actionLabel = 'Shop Now',
}: {
  title: string;
  subtitle?: string;
  icon?: IconName;
  products: Product[];
  actionLabel?: string;
}) {
  return (
    <View className="mt-8">
      <SectionHeader title={title} subtitle={subtitle} icon={icon} actionLabel={actionLabel} />
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, paddingTop: 14, gap: 12 }}
      >
        {products.map(p => (
          <View key={p.id} className="w-[165px]">
            <ProductCard product={p} />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

/* -------------------------------- Section ---------------------------------- */
// Lightweight vertical-rhythm wrapper so sections space consistently.
export function Section({ children, className = '' }: { children: ReactNode; className?: string }) {
  return <View className={`mt-8 ${className}`}>{children}</View>;
}
