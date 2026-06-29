import type { ProductColor, ProductDetail } from '../data';
import { useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const INK_900 = '#181d27'; // neutral-900

// B4 — title, price, and the colour + size selectors plus a quantity stepper. The
// colour index, size, and quantity live in their own blocks (nothing above needs them).
export function PurchasePanel({ product }: { product: ProductDetail }) {
  return (
    <View className="gap-[14px] p-4">
      <View className="gap-1">
        <Text variant="subheadline" emphasized className="text-neutral-600">{product.brand}</Text>
        <Text variant="title-2" emphasized className="text-neutral-900">{product.title}</Text>
      </View>
      <PriceRow
        price={product.price}
        oldPrice={product.oldPrice}
        save={product.savePercent}
        currency={product.currency}
      />
      <View className="h-px bg-neutral-200" />
      <ColorBlock colors={product.colors} />
      <SizeBlock sizes={product.sizes} />
      <Stepper />
    </View>
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

function Stepper() {
  const [qty, setQty] = useState(1);
  return (
    <View className="flex-row items-center self-start rounded-full border border-neutral-200">
      <Pressable onPress={() => setQty(value => Math.max(1, value - 1))} hitSlop={4} className="h-11 w-[42px] items-center justify-center">
        <Icon name="minus" size={18} color={INK_900} />
      </Pressable>
      <View className="h-11 w-[34px] items-center justify-center">
        <Text variant="subheadline" emphasized className="text-neutral-900">{qty}</Text>
      </View>
      <Pressable onPress={() => setQty(value => value + 1)} hitSlop={4} className="h-11 w-[42px] items-center justify-center">
        <Icon name="plus" size={18} color={INK_900} />
      </Pressable>
    </View>
  );
}
