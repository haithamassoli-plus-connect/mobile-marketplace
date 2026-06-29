import type { TrendingItem } from '@/features/home/data';
import { Button, Image, Text, View } from '@/components/ui';
import { trending } from '@/features/home/data';

import { Icon } from './icon';

function TrendingCard({
  item,
  className = '',
}: {
  item: TrendingItem;
  className?: string;
}) {
  return (
    <View
      className={`relative overflow-hidden rounded-xl bg-white shadow-md ${className}`}
    >
      <Image
        source={item.image}
        contentFit="cover"
        className="absolute inset-0 size-full"
      />
      <View className="absolute inset-x-0 top-0 h-1/4 bg-white/20" />
      <View className="p-3">
        <Text
          variant="caption-2"
          emphasized
          className="text-center text-gold-950"
        >
          {item.title}
        </Text>
      </View>
    </View>
  );
}

export function TrendingGrid() {
  const { featured, items } = trending;

  return (
    <View className="mt-8 gap-2">
      <View className="flex-row items-center justify-between px-4">
        <Text variant="title-3" emphasized className="text-secondary-950">
          Trending Collections
        </Text>
        <Button
          variant="ghost"
          className="my-0 h-auto flex-row items-center gap-1 rounded-md border border-neutral-300 px-2 py-1.5"
        >
          <Text variant="caption-1" className="text-secondary-950">
            Explore All
          </Text>
          <Icon name="arrow-right" size={10} color="#020617" />
        </Button>
      </View>

      <View className="h-[344px] flex-row gap-4 px-4">
        <TrendingCard item={featured} className="h-full flex-1" />

        <View className="w-[157px] gap-2">
          {items.map(item => (
            <TrendingCard key={item.id} item={item} className="h-[167px]" />
          ))}
        </View>
      </View>
    </View>
  );
}
