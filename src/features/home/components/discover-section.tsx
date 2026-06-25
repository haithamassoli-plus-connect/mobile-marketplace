import { Image, ScrollView, Text, View } from '@/components/ui';

import { discover } from '../data';
import { Chip, ProductCard, Rating } from './primitives';

// Discover section — curated "For you" picks: tabs, featured pick, category chips,
// and a 2-column recommended grid. Static render only.
export function DiscoverSection() {
  return (
    <View className="mt-8 px-4">
      {/* Header */}
      <Text variant="caption-1" className="text-gold-500 font-semibold tracking-wider">
        {discover.eyebrow}
      </Text>
      <Text variant="title-2" emphasized className="text-ink-800">{discover.title}</Text>
      <Text variant="subheadline" className="mt-1 text-neutral-500">{discover.subtitle}</Text>

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
              variant="subheadline"
              emphasized={i === 0}
              className={i === 0 ? 'text-ink-800' : 'font-medium text-neutral-500'}
            >
              {tab}
            </Text>
          </View>
        ))}
      </View>

      {/* Featured pick */}
      <View className="mt-4 flex-row items-center gap-3 rounded-2xl border border-neutral-200 bg-white p-3">
        <Image
          source={discover.featured.image}
          className="size-20 rounded-xl"
          contentFit="cover"
        />
        <View className="flex-1">
          <View className="self-start rounded-full bg-neutral-100 px-2 py-0.5">
            <Text variant="caption-2" className="text-neutral-600">{discover.featured.reason}</Text>
          </View>
          <Text variant="callout" className="text-ink-800 mt-1 font-bold">
            {discover.featured.title}
          </Text>
          <View className="mt-1 flex-row items-center gap-2">
            <Text variant="subheadline" className="text-gold-500 font-bold">
              {`$ ${discover.featured.price}`}
            </Text>
            <Rating value={discover.featured.rating} />
          </View>
          <View className="bg-gold-500 mt-2 self-start rounded-xl px-4 py-2">
            <Text variant="footnote" emphasized className="text-white">View item</Text>
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
        <Text variant="callout" className="text-ink-800 font-bold">Recommended for you</Text>
        <Text variant="footnote" emphasized className="text-gold-500">See all</Text>
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
