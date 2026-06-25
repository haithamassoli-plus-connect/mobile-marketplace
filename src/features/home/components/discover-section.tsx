import { Image, Text, View } from '@/components/ui';

import { discover } from '../data';
import { Icon } from './icon';
import { ProductCard } from './primitives';

// Discover section — gold eyebrow + title, a segmented tab bar, a full-width
// "Just Dropped" featured showcase, then a 2-column "Fresh this week" grid.
// ponytail: "New arrivals" (tab index 1) is the active tab, matching Figma.
export function DiscoverSection() {
  return (
    <View className="mt-8 gap-6 bg-neutral-50 px-4">
      {/* Header + tabs */}
      <View className="gap-4">
        <View className="gap-1.5">
          <Text variant="caption-1" emphasized className="text-gold-600">
            {discover.eyebrow}
          </Text>
          <Text variant="title-2" emphasized className="text-ink-900">
            {discover.title}
          </Text>
          <Text variant="subheadline" className="text-neutral-600">
            {discover.subtitle}
          </Text>
        </View>

        {/* Tab bar — segmented control, index 1 active */}
        <View className="flex-row gap-1 rounded-full bg-neutral-100 p-1">
          {discover.tabs.map((tab, i) => (
            <View
              key={tab}
              className={`flex-1 items-center rounded-full py-2 ${
                i === 1 ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                variant="subheadline"
                emphasized
                className={i === 1 ? 'text-ink-900' : 'text-neutral-500'}
              >
                {tab}
              </Text>
            </View>
          ))}
        </View>
      </View>

      {/* Featured showcase */}
      <View className="h-[260px] overflow-hidden rounded-2xl bg-neutral-100">
        <Image source={discover.featured.image} className="size-full" contentFit="cover" />
        <View className="absolute top-3 left-3 rounded-full bg-gold-500 px-2.5 py-[5px]">
          <Text variant="caption-2" emphasized className="text-ink-900">JUST DROPPED</Text>
        </View>
        <View className="absolute top-[45px] left-3 flex-row items-center gap-1 rounded-full bg-ink-900 px-2 py-1">
          <Icon name="clock" size={12} color="#FFFFFF" />
          <Text variant="caption-2" emphasized className="text-white">2h ago</Text>
        </View>
      </View>

      {/* Fresh this week grid */}
      <View className="gap-[18px]">
        <View className="flex-row items-center justify-between">
          <Text variant="subheadline" emphasized className="text-ink-900">Fresh this week</Text>
          <Text variant="footnote" className="text-gold-600">See all</Text>
        </View>

        <View className="flex-row flex-wrap gap-4">
          {discover.recommended.map(item => (
            <View key={item.id} className="w-[48%]">
              <ProductCard product={item} />
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
