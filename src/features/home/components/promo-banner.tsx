import type { Product } from '../data';

import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';

import { countdown, flashDeals, promo } from '../data';
import { Icon } from './icon';
import { IconButton } from './primitives';

// Full-bleed gold promo block: eyebrow, glass countdown timer, a flash-deals rail
// of rich cards, a headline + dark CTA, and a dismiss link.
// ponytail: static countdown values — wire to a real timer when needed.

const TIMER_CELLS = [
  { value: countdown.days, label: 'DAYS' },
  { value: countdown.hours, label: 'HRS' },
  { value: countdown.minutes, label: 'MINS' },
  { value: countdown.seconds, label: 'SECS' },
] as const;

function TimerCell({ value, label }: { value: string; label: string }) {
  return (
    <View className="flex-1 items-center justify-center gap-0.5">
      {/* ponytail: 26px bold isn't a text variant — inline the Figma cell size. */}
      <Text className="text-[26px] leading-[31px] font-bold text-[#111827]">{value}</Text>
      <Text className="text-[9px] leading-[11px] font-medium tracking-[0.7px] text-[#4a5463]">
        {label}
      </Text>
    </View>
  );
}

function TimerColon() {
  return <Text className="text-[22px] leading-[28px] font-bold text-[#111827]/45">:</Text>;
}

// ponytail: stock/flash-timer copy is decorative and not in the data module —
// kept static to stay faithful to the Figma flash card.
function FlashCard({ product }: { product: Product }) {
  return (
    <View className="w-[290px] overflow-hidden rounded-2xl bg-white shadow-lg">
      <View className="relative h-[230px]">
        <Image source={product.image} className="size-full" contentFit="cover" />
        {product.badge
          ? (
              <View className="absolute top-3 left-3 rounded-full bg-error-500 px-2.5 py-[5px]">
                <Text variant="caption-1" emphasized className="text-white">{product.badge}</Text>
              </View>
            )
          : null}
        <IconButton name="heart" size={18} className="absolute top-3 right-3 bg-white" />
        <View className="absolute bottom-3 left-3 flex-row items-center gap-1 rounded-full bg-ink-900 px-2 py-1">
          <Icon name="clock" size={12} color="#ffffff" />
          <Text variant="caption-2" emphasized className="text-white">02:14:33</Text>
        </View>
      </View>

      <View className="gap-1 px-4 pt-3.5 pb-4">
        <Text variant="caption-2" className="text-neutral-500">FLASH DEAL</Text>
        <Text numberOfLines={1} variant="subheadline" emphasized className="text-ink-900">
          {product.title}
        </Text>

        <View className="gap-1.5">
          <View className="flex-row items-center justify-between">
            <Text variant="caption-2" emphasized className="text-gold-600">Selling fast</Text>
            <Text variant="caption-2" className="text-neutral-500">Only 9 left</Text>
          </View>
          <View className="h-1.5 overflow-hidden rounded-full bg-neutral-200">
            <View className="h-full w-3/4 rounded-full bg-gold-500" />
          </View>
        </View>

        <View className="flex-row items-center justify-between pt-1.5">
          <View className="flex-row items-baseline gap-2">
            <Text variant="headline" className="text-gold-500">{`$${product.price}.00`}</Text>
            {product.oldPrice
              ? (
                  <Text variant="caption-1" className="text-neutral-500 line-through">
                    {`$${product.oldPrice}.00`}
                  </Text>
                )
              : null}
          </View>
          <IconButton name="shopping-cart" size={17} className="bg-white shadow-sm" />
        </View>
      </View>
    </View>
  );
}

export function PromoBanner() {
  return (
    <View className="mt-8 w-full gap-4 bg-gold-500 p-5">
      {/* Eyebrow */}
      <Text className="text-center text-[12px]/4 font-medium tracking-[0.9px] text-[#1a1a2e]">
        {promo.eyebrow}
      </Text>

      {/* Glass countdown timer */}
      <View className="flex-row items-center justify-center gap-1 rounded-2xl border border-white/65 bg-white/30 px-2 pt-3.5 pb-3 shadow-lg">
        {TIMER_CELLS.map((cell, index) => (
          <View key={cell.label} className="flex-1 flex-row items-center justify-center">
            {index > 0 ? <TimerColon /> : null}
            <TimerCell value={cell.value} label={cell.label} />
          </View>
        ))}
      </View>

      {/* Flash deal cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ gap: 16 }}
      >
        {flashDeals.map(item => (
          <FlashCard key={item.id} product={item} />
        ))}
      </ScrollView>

      {/* Headline */}
      <Text variant="title-2" emphasized className="text-center text-[#111827]">
        {promo.headline}
      </Text>

      {/* CTA */}
      <Pressable className="flex-row items-center justify-center gap-2 rounded-xl bg-[#1a1a2e] px-5 py-3.5 shadow-md">
        <Text variant="headline" className="text-white">{promo.cta}</Text>
        <Icon name="arrow-right" size={18} color="#ffffff" />
      </Pressable>

      {/* Dismiss */}
      <Text variant="footnote" className="text-center text-[#1a1a2e]/70">
        {promo.dismiss}
      </Text>
    </View>
  );
}
