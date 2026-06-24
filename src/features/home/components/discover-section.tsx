import { Image, ScrollView, Text, View } from '@/components/ui';

import { discover } from '../data';
import { Chip, ProductCard, Rating } from './primitives';

// Discover section — curated "For you" picks: tabs, featured pick, category chips,
// and a 2-column recommended grid. Static render only.
export function DiscoverSection() {
  return (
    <View className="mt-8 px-4">
      {/* Header */}
      <Text className="text-[12px] font-semibold tracking-wider text-gold-500">
        {discover.eyebrow}
      </Text>
      <Text className="text-[22px] font-bold text-ink-800">{discover.title}</Text>
      <Text className="mt-1 text-[14px] text-neutral-500">{discover.subtitle}</Text>

      {/* Tabs — segmented control, index 0 active */}
      <View className="mt-4 flex-row rounded-full bg-neutral-100 p-1">
        {discover.tabs.map((tab, i) => (
          <View
            key={tab}
            className={`flex-1 items-center rounded-full py-2 ${
              i === 0 ? 'bg-white shadow-sm' : ''
            }`}
          >
            <Text
              className={
                i === 0
                  ? 'text-[15px] font-semibold text-ink-800'
                  : 'text-[15px] font-medium text-neutral-500'
              }
            >
              {tab}
            </Text>
          </View>
        ))}
      </View>

      {/* Featured pick */}
      <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-[#e9eaeb] bg-white p-3">
        <Image
          source={discover.featured.image}
          className="size-20 rounded-xl"
          contentFit="cover"
        />
        <View className="flex-1">
          <View className="self-start rounded-full bg-neutral-100 px-2 py-0.5">
            <Text className="text-[11px] text-neutral-600">{discover.featured.reason}</Text>
          </View>
          <Text className="mt-1 text-[16px] font-bold text-ink-800">
            {discover.featured.title}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text className="text-[15px] font-bold text-gold-500">
              {`$ ${discover.featured.price}`}
            </Text>
            <Rating value={discover.featured.rating} />
          </View>
          <View className="mt-2 self-start rounded-xl bg-gold-500 px-4 py-2">
            <Text className="text-[13px] font-semibold text-white">View item</Text>
          </View>
        </View>
      </View>

      {/* Category chips */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ gap: 8 }}
      >
        {discover.categories.map((c, i) => (
          <Chip key={c} label={c} active={i === 0} />
        ))}
      </ScrollView>

      {/* Recommended */}
      <View className="mt-5 flex-row items-center justify-between">
        <Text className="text-[16px] font-bold text-ink-800">Recommended for you</Text>
        <Text className="text-[13px] font-semibold text-gold-500">See all</Text>
      </View>

      <View className="mt-3 flex-row flex-wrap gap-3">
        {discover.recommended.map(item => (
          <View key={item.id} className="w-[48%]">
            <ProductCard product={item} />
          </View>
        ))}
      </View>
    </View>
  );
}
