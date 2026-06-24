import { ScrollView, Text, View } from '@/components/ui';

import { countdown, flashDeals, promo } from '../data';
import { Icon } from './icon';
import { ProductCard } from './primitives';

// Full-bleed gold promo block with a glass countdown timer and a flash deals rail.
// ponytail: static countdown values — wire to a real timer when needed.

const TIMER_CELLS = [
  { value: countdown.days, label: 'DAYS' },
  { value: countdown.hours, label: 'HRS' },
  { value: countdown.minutes, label: 'MINS' },
  { value: countdown.seconds, label: 'SECS' },
] as const;

function TimerCell({ value, label }: { value: string; label: string }) {
  return (
    <View className="h-[60px] w-[72px] items-center justify-center rounded-2xl bg-white/25">
      <Text variant="title-1" emphasized className="text-white">{value}</Text>
      <Text variant="caption-2" className="mt-0.5 text-white/80">{label}</Text>
    </View>
  );
}

export function PromoBanner() {
  return (
    <View className="mt-8 w-full bg-gold-500 py-6">
      {/* Eyebrow */}
      <Text variant="footnote" className="px-5 font-bold tracking-wide text-ink-900">
        {promo.eyebrow}
      </Text>

      {/* Glass countdown timer */}
      <View className="mt-3 flex-row items-center px-5">
        {TIMER_CELLS.map((cell, index) => (
          <View key={cell.label} className="flex-row items-center">
            {index > 0
              ? (
                  <Text variant="title-2" emphasized className="mx-1 text-white">:</Text>
                )
              : null}
            <TimerCell value={cell.value} label={cell.label} />
          </View>
        ))}
      </View>

      {/* Flash deal cards */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-5"
        contentContainerStyle={{ paddingHorizontal: 20, gap: 12 }}
      >
        {flashDeals.map(item => (
          <View key={item.id} className="w-[200px]">
            <ProductCard product={item} />
          </View>
        ))}
      </ScrollView>

      {/* Footer */}
      <View className="mt-6 px-5">
        <Text variant="title-2" emphasized className="text-ink-900">{promo.headline}</Text>

        <View className="mt-3 h-[51px] flex-row items-center justify-center gap-2 rounded-xl bg-ink-900">
          <Text variant="callout" emphasized className="text-white">{promo.cta}</Text>
          <Icon name="arrow-right" size={18} color="#ffffff" />
        </View>

        <Text variant="footnote" className="mt-3 text-center text-ink-900/70 underline">
          {promo.dismiss}
        </Text>
      </View>
    </View>
  );
}
