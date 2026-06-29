import type { ProductColor, ProductDetail, SizeGuide } from '../data';
import { useState } from 'react';

import { Button, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

import { sizeGuides } from '../data';
import { SizeGuideSheet } from './size-guide-sheet';

const INK_900 = '#181d27';

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
      <SizeBlock sizes={product.sizes} productTitle={product.title} sizeGuide={sizeGuides.hoodie} />
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
          <Button
            key={color.hex}
            variant="ghost"
            onPress={() => setIndex(i)}
            className={`my-0 h-auto rounded-full p-0.5 ${i === index ? 'border-2 border-gold-500' : 'border-2 border-transparent'}`}
          >
            <View className="size-[38px] rounded-full" style={{ backgroundColor: color.hex }} />
          </Button>
        ))}
      </View>
    </View>
  );
}

function SizeBlock({ sizes, productTitle, sizeGuide }: { sizes: string[]; productTitle: string; sizeGuide: SizeGuide }) {
  const [selected, setSelected] = useState('M');
  const sizeModal = useModal();
  return (
    <View className="gap-2.5">
      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-2">
          <Text variant="caption-2" emphasized className="text-neutral-500">SIZE</Text>
          <Text variant="footnote" emphasized className="text-neutral-800">{selected}</Text>
        </View>
        <Button variant="ghost" onPress={() => sizeModal.present()} hitSlop={8} className="my-0 h-auto p-0">
          <Text variant="footnote" emphasized className="text-gold-700">Size Guide</Text>
        </Button>
      </View>
      <View className="flex-row gap-2">
        {sizes.map(size => (
          <Button
            key={size}
            variant="ghost"
            onPress={() => setSelected(size)}
            className={`my-0 h-10 flex-1 items-center justify-center rounded-[10px] px-0 ${
              size === selected ? 'bg-gold-500' : 'border border-neutral-200 bg-white'
            }`}
          >
            <Text variant="footnote" emphasized className={size === selected ? 'text-neutral-1000' : 'text-neutral-700'}>
              {size}
            </Text>
          </Button>
        ))}
      </View>
      <SizeGuideSheet ref={sizeModal.ref} title={productTitle} guide={sizeGuide} />
    </View>
  );
}

function Stepper() {
  const [qty, setQty] = useState(1);
  return (
    <View className="flex-row items-center self-start rounded-full border border-neutral-200">
      <Button variant="ghost" onPress={() => setQty(value => Math.max(1, value - 1))} hitSlop={4} className="my-0 h-11 w-[42px] items-center justify-center rounded-none px-0">
        <Icon name="minus" size={18} color={INK_900} />
      </Button>
      <View className="h-11 w-[34px] items-center justify-center">
        <Text variant="subheadline" emphasized className="text-neutral-900">{qty}</Text>
      </View>
      <Button variant="ghost" onPress={() => setQty(value => value + 1)} hitSlop={4} className="my-0 h-11 w-[42px] items-center justify-center rounded-none px-0">
        <Icon name="plus" size={18} color={INK_900} />
      </Button>
    </View>
  );
}
