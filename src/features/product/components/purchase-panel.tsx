import type { ProductColor, ProductDetail } from '../data';
import { useState } from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Stars } from './stars';

const GOLD = '#dbb42c'; // gold-500
const NEUTRAL_500 = '#717680';

// B4 — title, seller, rating, price, and the colour + size selectors. The colour
// index and size live in their own blocks (nothing above needs them).
export function PurchasePanel({ product }: { product: ProductDetail }) {
  return (
    <View className="gap-[14px] p-4">
      <SellerChip seller={product.seller} avatar={product.sellerAvatar} />
      <View className="gap-1">
        <Text variant="subheadline" emphasized className="text-neutral-600">{product.brand}</Text>
        <Text variant="title-2" emphasized className="text-neutral-900">{product.title}</Text>
      </View>
      <RatingBox rating={product.rating} reviewCount={product.reviewCount} />
      <PriceRow
        price={product.price}
        oldPrice={product.oldPrice}
        save={product.savePercent}
        currency={product.currency}
      />
      <View className="h-px bg-neutral-200" />
      <ColorBlock colors={product.colors} />
      <SizeBlock sizes={product.sizes} />
    </View>
  );
}

// ponytail: decorative — opens the seller profile once routing exists.
function SellerChip({ seller, avatar }: { seller: string; avatar: string }) {
  return (
    <Pressable className="flex-row items-center gap-2 self-start rounded-full border border-neutral-200 py-1 pr-2.5 pl-1.5">
      <Image source={avatar} contentFit="cover" className="size-6 rounded-full" />
      <Text variant="footnote" className="text-neutral-500">Sold by</Text>
      <Text variant="footnote" emphasized className="text-neutral-900">{seller}</Text>
      <Icon name="badge-check" size={14} color={GOLD} />
      <Icon name="chevron-right" size={16} color={NEUTRAL_500} />
    </Pressable>
  );
}

// ponytail: decorative — scrolls to the reviews section once wired.
function RatingBox({ rating, reviewCount }: { rating: number; reviewCount: number }) {
  return (
    <Pressable className="flex-row items-center justify-between rounded-xl bg-neutral-50 px-3 py-2">
      <View className="flex-row items-center gap-2">
        <Stars value={rating} size={15} />
        <Text variant="subheadline" emphasized className="text-neutral-800">{rating.toFixed(1)}</Text>
        <Text variant="footnote" className="text-neutral-500">{`${reviewCount} reviews`}</Text>
      </View>
      <Icon name="chevron-right" size={18} color={NEUTRAL_500} />
    </Pressable>
  );
}

function PriceRow({ price, oldPrice, save, currency }: { price: number; oldPrice: number; save: number; currency: string }) {
  return (
    <View className="flex-row items-center gap-2.5">
      <Text variant="title-2" emphasized className="text-gold-600">{`${currency} ${price}`}</Text>
      <Text variant="subheadline" className="text-neutral-500 line-through">{`${currency} ${oldPrice}`}</Text>
      <View className="rounded-md bg-error-100 px-2 py-[3px]">
        <Text variant="caption-2" emphasized className="text-error-700">{`Save ${save}%`}</Text>
      </View>
    </View>
  );
}

function ColorBlock({ colors }: { colors: ProductColor[] }) {
  const [index, setIndex] = useState(0);
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center gap-2">
        <Text variant="caption-2" emphasized className="text-neutral-500">COLOR</Text>
        <Text variant="footnote" emphasized className="text-neutral-800">{colors[index].name}</Text>
      </View>
      <View className="flex-row gap-3">
        {colors.map((color, i) => (
          <Pressable
            key={color.hex}
            onPress={() => setIndex(i)}
            className={`rounded-full p-0.5 ${i === index ? 'border-2 border-gold-500' : 'border-2 border-transparent'}`}
          >
            {/* ponytail: raw hex — fabric colours have no token. */}
            <View className="size-[38px] rounded-full" style={{ backgroundColor: color.hex }} />
          </Pressable>
        ))}
      </View>
    </View>
  );
}

function SizeBlock({ sizes }: { sizes: string[] }) {
  const [selected, setSelected] = useState('M');
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text variant="caption-2" emphasized className="text-neutral-500">SIZE</Text>
          <Text variant="footnote" emphasized className="text-neutral-800">{selected}</Text>
        </View>
        {/* ponytail: decorative — Size Guide sheet not built. */}
        <Pressable hitSlop={8}>
          <Text variant="footnote" emphasized className="text-gold-700">Size Guide</Text>
        </Pressable>
      </View>
      <View className="flex-row gap-2">
        {sizes.map(size => (
          <Pressable
            key={size}
            onPress={() => setSelected(size)}
            className={`h-10 flex-1 items-center justify-center rounded-[10px] ${
              size === selected ? 'bg-gold-500' : 'border border-neutral-200 bg-white'
            }`}
          >
            <Text variant="footnote" emphasized className={size === selected ? 'text-neutral-1000' : 'text-neutral-700'}>
              {size}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  );
}
