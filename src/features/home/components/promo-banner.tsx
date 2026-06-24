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
      <Text className="text-[28px] font-bold text-white">{value}</Text>
      <Text className="mt-0.5 text-[11px] text-white/80">{label}</Text>
    </View>
  );
}

export function PromoBanner() {
  return (
    <View className="mt-8 w-full bg-gold-500 py-6">
      {/* Eyebrow */}
      <Text className="px-5 text-[13px] font-bold tracking-wide text-ink-900">
        {promo.eyebrow}
      </Text>

      {/* Glass countdown timer */}
      <View className="mt-3 flex-row items-center px-5">
        {TIMER_CELLS.map((cell, index) => (
          <View key={cell.label} className="flex-row items-center">
            {index > 0
              ? (
                  <Text className="mx-1 text-[24px] font-bold text-white">:</Text>
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
        <Text className="text-[22px] font-bold text-ink-900">{promo.headline}</Text>

        <View className="mt-3 h-[51px] flex-row items-center justify-center gap-2 rounded-xl bg-ink-900">
          <Text className="text-[16px] font-semibold text-white">{promo.cta}</Text>
          <Icon name="arrow-right" size={18} color="#ffffff" />
        </View>

        <Text className="mt-3 text-center text-[13px] text-ink-900/70 underline">
          {promo.dismiss}
        </Text>
      </View>
    </View>
  );
}
