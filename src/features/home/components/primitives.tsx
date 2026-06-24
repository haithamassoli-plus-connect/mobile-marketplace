import type { ReactNode } from 'react';
import type { Product } from '../data';

import type { IconName } from './icon';
import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from './icon';

// Shared building blocks reused across home sections.
// ponytail: plain props, no theming layer — gold/ink come straight from tokens.

/* -------------------------------- IconButton ------------------------------- */
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
      className={`size-[34px] items-center justify-center rounded-full ${className}`}
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
        className={`text-[13px] font-semibold ${active ? 'text-white' : 'text-ink-800'}`}
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
      <Text className="text-[12px] font-semibold text-ink-800">{value.toFixed(1)}</Text>
    </View>
  );
}

/* ------------------------------ SectionHeader ------------------------------ */
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
    <View className={`px-4 ${className}`}>
      <View className="flex-row items-center justify-between">
        <View className="flex-1 flex-row items-center gap-2">
          {icon ? <Icon name={icon} size={20} color="#DBB42C" /> : null}
          <Text className="text-[20px] font-bold text-ink-800">{title}</Text>
        </View>
        {actionLabel
          ? (
              <Pressable className="flex-row items-center gap-1 rounded-full bg-gold-500 px-4 py-2">
                <Text className="text-[13px] font-semibold text-white">{actionLabel}</Text>
                <Icon name="arrow-right" size={14} color="#ffffff" />
              </Pressable>
            )
          : null}
      </View>
      {subtitle ? <Text className="mt-1 text-[14px] text-neutral-500">{subtitle}</Text> : null}
    </View>
  );
}

/* ---------------------------------- Badge ---------------------------------- */
export function ProductBadge({
  label,
  tone = 'dark',
}: {
  label: string;
  tone?: 'dark' | 'gold';
}) {
  return (
    <View
      className={`rounded-full px-2 py-1 ${tone === 'gold' ? 'bg-gold-500' : 'bg-[#1a1a2e]'}`}
    >
      <Text className="text-[11px] font-semibold text-white">{label}</Text>
    </View>
  );
}

/* ------------------------------- ProductCard ------------------------------- */
// Fills its parent width. Wrap in a fixed-width View (rails) or flex-1 (grids).
export function ProductCard({ product }: { product: Product }) {
  return (
    <View className="w-full overflow-hidden rounded-2xl border border-[#e9eaeb] bg-white pt-2 pb-3 shadow-sm">
      <View className="relative mx-2 h-[149px] overflow-hidden rounded-xl">
        <Image source={product.image} className="size-full" contentFit="cover" />
        <View className="absolute inset-x-0 top-0 flex-row items-start justify-between p-2">
          {product.badge ? <ProductBadge label={product.badge} tone={product.badgeTone} /> : <View />}
          <IconButton name="heart" size={16} />
        </View>
      </View>

      <View className="gap-1 px-2 pt-2.5">
        <Text numberOfLines={1} className="text-[15px] font-semibold text-ink-800">
          {product.title}
        </Text>
        {product.rating ? <Rating value={product.rating} /> : null}
        <View className="flex-row items-baseline gap-1.5">
          <Text className="text-[17px] font-semibold text-gold-500">{`$ ${product.price}`}</Text>
          {product.oldPrice
            ? (
                <Text className="text-[12px] text-neutral-500 line-through">{`$ ${product.oldPrice}`}</Text>
              )
            : null}
        </View>
      </View>

      <Pressable className="mx-2 mt-2.5 h-[42px] items-center justify-center rounded-xl bg-gold-500">
        <Text className="text-[13px] font-semibold text-white">Add to cart</Text>
      </Pressable>
    </View>
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
