import { useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const INK_900 = '#181d27'; // neutral-900
const INK_950 = '#0a0d12'; // neutral-950
const GOLD = '#dbb42c'; // gold-500
const WHITE = '#ffffff';

// C — sticky bottom bar (rendered outside the ScrollView). Owns quantity (>=1) and
// the wishlist toggle; the cart label reflects qty * price.
export function PurchaseBar({ price, currency, insetBottom }: { price: number; currency: string; insetBottom: number }) {
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const total = qty * price;
  return (
    <View
      className="gap-3 rounded-t-[24px] border-t border-neutral-200 bg-white px-[14px] pt-4 shadow-sm"
      style={{ paddingBottom: insetBottom + 14 }}
    >
      <View className="flex-row items-center justify-between">
        <Stepper
          qty={qty}
          onDecrement={() => setQty(value => Math.max(1, value - 1))}
          onIncrement={() => setQty(value => value + 1)}
        />
        <View className="flex-row items-center gap-1.5 rounded-full bg-success-50 py-1.5 pr-3 pl-2.5">
          <View className="size-[7px] rounded-full bg-success-600" />
          <Text variant="footnote" emphasized className="text-success-700">In Stock</Text>
        </View>
      </View>

      {/* ponytail: decorative — Add to cart has no cart store yet. */}
      <Pressable className="h-[52px] flex-row items-center justify-center gap-2.5 rounded-full bg-neutral-900">
        <Icon name="shopping-cart" size={22} color={WHITE} />
        <Text variant="callout" emphasized className="text-white">
          {`Add to cart  ·  ${currency} ${total}`}
        </Text>
      </Pressable>

      <View className="flex-row items-center gap-2.5">
        {/* ponytail: decorative — Buy it now has no checkout yet. */}
        <Pressable className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gold-500">
          <Icon name="zap" size={20} color={INK_950} />
          <Text variant="callout" emphasized className="text-neutral-950">Buy it now</Text>
        </Pressable>
        <Pressable
          onPress={() => setWished(value => !value)}
          accessibilityRole="button"
          accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="h-[52px] w-[60px] items-center justify-center rounded-2xl border-[1.5px] border-neutral-300 bg-white"
        >
          <Icon name="heart" size={22} color={wished ? GOLD : INK_900} />
        </Pressable>
      </View>
    </View>
  );
}

function Stepper({ qty, onDecrement, onIncrement }: { qty: number; onDecrement: () => void; onIncrement: () => void }) {
  return (
    <View className="flex-row items-center rounded-full border border-neutral-200">
      <Pressable onPress={onDecrement} hitSlop={4} className="h-11 w-[42px] items-center justify-center">
        <Icon name="minus" size={18} color={INK_900} />
      </Pressable>
      <View className="h-11 w-[34px] items-center justify-center">
        <Text variant="subheadline" emphasized className="text-neutral-900">{qty}</Text>
      </View>
      <Pressable onPress={onIncrement} hitSlop={4} className="h-11 w-[42px] items-center justify-center">
        <Icon name="plus" size={18} color={INK_900} />
      </Pressable>
    </View>
  );
}
