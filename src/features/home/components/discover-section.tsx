import { useState } from 'react';

import { Image, Pressable, Text, View } from '@/components/ui';

import { discover } from '../data';
import { Icon } from './icon';
import { Chip, ProductCard } from './primitives';

// Discover section — gold eyebrow + title, then a segmented tab bar that swaps
// between "For you" (Top Pick + recommended grid) and "New arrivals"
// (Just Dropped hero + fresh-this-week grid). Tabs are interactive.
export function DiscoverSection() {
  const [tab, setTab] = useState(0);
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

        {/* Tab bar — segmented control, tap to switch */}
        <View className="flex-row gap-1 rounded-full bg-neutral-100 p-1">
          {discover.tabs.map((t, i) => (
            <Pressable
              key={t}
              onPress={() => setTab(i)}
              className={`flex-1 items-center rounded-full py-2 ${
                tab === i ? 'bg-white shadow-sm' : ''
              }`}
            >
              <Text
                variant="subheadline"
                emphasized
                className={tab === i ? 'text-ink-900' : 'text-neutral-500'}
              >
                {t}
              </Text>
            </Pressable>
          ))}
        </View>
      </View>

      {tab === 0 ? <ForYou /> : <NewArrivals />}
    </View>
  );
}

// "For you" — horizontal Top Pick card, interest chips, 2-column recommended grid.
function ForYou() {
  const { featured } = discover;
  return (
    <View className="gap-3">
      {/* Top Pick — horizontal card */}
      <View className="flex-row items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white p-3">
        <View className="relative h-[126px] w-[116px] overflow-hidden rounded-xl">
          <Image source={featured.image} className="size-full" contentFit="cover" />
          <View className="absolute top-1.5 left-1.5 rounded-full bg-gold-500 px-2 py-1">
            <Text variant="caption-2" emphasized className="text-ink-900">TOP PICK</Text>
          </View>
        </View>

        <View className="flex-1 gap-2">
          <View className="self-start rounded-full bg-neutral-100 px-2.5 py-[5px]">
            <Text variant="caption-2" className="text-neutral-600">{featured.reason}</Text>
          </View>
          <Text variant="headline" className="text-ink-900">{featured.title}</Text>
          <View className="flex-row items-center gap-2">
            <Text variant="callout" emphasized className="text-gold-500">{`$ ${featured.price}`}</Text>
            <Text variant="footnote" className="text-neutral-600">{`★ ${featured.rating}`}</Text>
          </View>
          <Pressable className="self-start rounded-[10px] bg-gold-500 px-[18px] py-[9px]">
            <Text variant="footnote" emphasized className="text-ink-900">View item</Text>
          </Pressable>
        </View>
      </View>

      {/* Recommended for you */}
      <View className="gap-3">
        <View className="flex-row items-center justify-between">
          <Text variant="subheadline" emphasized className="text-ink-900">Recommended for you</Text>
          <Text variant="footnote" className="text-gold-600">See all</Text>
        </View>

        {/* Interest chips — first active */}
        <View className="flex-row flex-wrap gap-2">
          {discover.categories.map((c, i) => (
            <Chip key={c} label={c} active={i === 0} />
          ))}
        </View>

        <Grid items={discover.recommended} />
      </View>
    </View>
  );
}

// "New arrivals" — Just Dropped hero, then a fresh-this-week grid.
function NewArrivals() {
  const { hero, items } = discover.newArrivals;
  return (
    <View className="gap-[18px]">
      {/* Just Dropped hero */}
      <View className="h-[260px] overflow-hidden rounded-2xl bg-neutral-100">
        <Image source={hero.image} className="size-full" contentFit="cover" />
        <View className="absolute top-3 left-3 rounded-full bg-gold-500 px-2.5 py-[5px]">
          <Text variant="caption-2" emphasized className="text-ink-900">JUST DROPPED</Text>
        </View>
        <View className="absolute top-[45px] left-3 flex-row items-center gap-1 rounded-full bg-ink-900 px-2 py-1">
          <Icon name="clock" size={12} color="#FFFFFF" />
          <Text variant="caption-2" emphasized className="text-white">{hero.timeAgo}</Text>
        </View>
      </View>

      {/* Fresh this week */}
      <View className="gap-[18px]">
        <View className="flex-row items-center justify-between">
          <Text variant="subheadline" emphasized className="text-ink-900">Fresh this week</Text>
          <Text variant="footnote" className="text-gold-600">See all</Text>
        </View>
        <Grid items={items} />
      </View>
    </View>
  );
}

// 2-column product grid — justify-between keeps two cards per row.
function Grid({ items }: { items: typeof discover.recommended }) {
  return (
    <View className="flex-row flex-wrap justify-between gap-y-[15px]">
      {items.map(item => (
        <View key={item.id} className="w-[48%]">
          <ProductCard product={item} />
        </View>
      ))}
    </View>
  );
}
