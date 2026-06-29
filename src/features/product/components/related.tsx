import type { RelatedProduct } from '../data';
import { router } from 'expo-router';

import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { CURRENCY } from '../data';

const GOLD_600 = '#b8941f';

// B8 — horizontal rail of recommendations. Static 5 items → a plain ScrollView,
// no virtualization needed.
export function Related({ items }: { items: RelatedProduct[] }) {
  return (
    <View className="gap-4 py-5">
      <View className="flex-row items-center justify-between px-4">
        <Text variant="headline" className="font-bold text-neutral-900">You may also like</Text>
        {/* ponytail: decorative — View all listing not built. */}
        <Pressable className="flex-row items-center gap-1">
          <Text variant="footnote" emphasized className="text-gold-600">View all</Text>
          <Icon name="chevron-right" size={16} color={GOLD_600} />
        </Pressable>
      </View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {items.map(item => (
          <RelatedCard key={item.id} item={item} />
        ))}
      </ScrollView>
    </View>
  );
}

function RelatedCard({ item }: { item: RelatedProduct }) {
  return (
    <Pressable
      onPress={() => router.push({ pathname: '/product', params: { id: item.id } })}
      className="w-[158px] overflow-hidden rounded-2xl border border-neutral-200"
    >
      <Image source={item.image} contentFit="cover" className="h-[176px] w-full bg-neutral-100" />
      <View className="gap-1 px-3 pt-2.5 pb-3">
        <Text variant="caption-2" emphasized className="tracking-[0.4px] text-neutral-500 uppercase">
          {item.category}
        </Text>
        <Text numberOfLines={1} variant="footnote" emphasized className="text-neutral-900">{item.title}</Text>
        <View className="flex-row items-center gap-1.5">
          <Text variant="headline" className="font-bold text-gold-600">{`${CURRENCY} ${item.price}`}</Text>
          <Text variant="caption-1" className="text-neutral-400 line-through">{`${CURRENCY} ${item.oldPrice}`}</Text>
        </View>
      </View>
    </Pressable>
  );
}
