import { Image, ScrollView, Text, View } from '@/components/ui';
import { IconButton } from '@/features/home/components/primitives';
import { featured } from '@/features/home/data';

export function FeaturedRail() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-6"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
    >
      {featured.map(item => (
        <View
          key={item.id}
          className="relative h-[384px] w-[300px] overflow-hidden rounded-2xl"
        >
          <Image
            source={item.image}
            contentFit="cover"
            className="absolute inset-0 size-full"
          />
          {/* Scrims for legibility */}
          <View className="absolute inset-0 bg-black/30" />
          <View className="absolute inset-x-0 bottom-0 h-1/2 bg-black/40" />

          {/* Top content */}
          <View className="p-4">
            <View className="self-start rounded-full bg-white/20 px-2.5 py-1">
              <Text variant="caption-2" emphasized className="text-white">
                {item.brand}
              </Text>
            </View>
            <Text
              variant="headline"
              className="mt-3 font-bold text-white"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              variant="footnote"
              className="mt-1 text-white/80"
              numberOfLines={2}
            >
              {item.description}
            </Text>
          </View>

          {/* Bottom bar */}
          <View className="absolute inset-x-4 bottom-4 flex-row items-center justify-between">
            <View className="h-[34px] flex-row items-center rounded-full bg-white/15 px-3">
              <Text variant="footnote" className="text-gold-300 font-bold">
                {item.discount}
              </Text>
              <Text variant="footnote" className="mx-2 text-white/40">|</Text>
              <Text variant="footnote" className="font-bold text-white">BUY NOW</Text>
            </View>
            <View className="flex-row gap-2">
              <IconButton name="shopping-cart" />
              <IconButton name="heart" />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
