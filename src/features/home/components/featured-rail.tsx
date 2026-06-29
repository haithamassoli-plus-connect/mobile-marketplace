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
          className="relative h-[384px] w-[320px] overflow-hidden rounded-3xl"
        >
          <Image
            source={item.image}
            contentFit="cover"
            className="absolute inset-0 size-full"
          />
          <View className="absolute inset-0 bg-black/35" />

          <View className="absolute inset-x-4 top-4 gap-1.5">
            <View className="self-start rounded-full bg-white px-1 py-0.5">
              <Text variant="caption-2" emphasized className="text-secondary-950">
                {item.brand}
              </Text>
            </View>
            <Text
              variant="title-3"
              emphasized
              className="text-white"
              numberOfLines={2}
            >
              {item.title}
            </Text>
            <Text
              variant="caption-1"
              className="text-neutral-200"
              numberOfLines={3}
            >
              {item.description}
            </Text>
          </View>

          <View className="absolute inset-x-4 bottom-4 flex-row items-center justify-between">
            <View className="flex-row items-center gap-2 rounded-[22px] bg-white px-4 py-2 shadow-sm">
              <Text variant="footnote" emphasized className="text-success-700">
                {item.discount}
              </Text>
              <Text variant="footnote" className="text-neutral-300">
                |
              </Text>
              <Text variant="footnote" emphasized className="text-neutral-900">
                BUY NOW
              </Text>
            </View>
            <View className="flex-row gap-3">
              <IconButton name="shopping-cart" />
              <IconButton name="heart" />
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}
