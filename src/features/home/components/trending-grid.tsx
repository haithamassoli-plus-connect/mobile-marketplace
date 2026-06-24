import { Image, Text, View } from '@/components/ui';
import { trending } from '@/features/home/data';

import { SectionHeader } from './primitives';

export function TrendingGrid() {
  const { featured, items } = trending;

  return (
    <View className="mt-8">
      <SectionHeader title="Trending" actionLabel="View all" />

      <View className="mt-3 h-[344px] flex-row gap-3 px-4">
        {/* LEFT: tall featured card */}
        <View className="relative flex-1 overflow-hidden rounded-2xl">
          <Image
            source={featured.image}
            contentFit="cover"
            className="absolute inset-0 size-full"
          />
          <View className="absolute inset-x-0 bottom-0 h-1/3 bg-black/45" />
          <View className="absolute inset-x-3 bottom-3">
            {!!featured.subtitle && (
              <Text className="text-[11px] text-white/80 uppercase">
                {featured.subtitle}
              </Text>
            )}
            <Text className="text-[15px] font-semibold text-white">
              {featured.title}
            </Text>
          </View>
        </View>

        {/* RIGHT: two stacked cards */}
        <View className="flex-1 justify-between gap-3">
          {items.map(item => (
            <View
              key={item.id}
              className="relative flex-1 overflow-hidden rounded-2xl"
            >
              <Image
                source={item.image}
                contentFit="cover"
                className="absolute inset-0 size-full"
              />
              <View className="absolute inset-x-0 bottom-0 h-1/3 bg-black/45" />
              <View className="absolute inset-x-2 bottom-2">
                {!!item.subtitle && (
                  <Text className="text-[10px] text-white/80 uppercase">
                    {item.subtitle}
                  </Text>
                )}
                <Text className="text-[13px] font-semibold text-white">
                  {item.title}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
