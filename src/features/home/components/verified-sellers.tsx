import { Image, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Rating } from '@/features/home/components/primitives';
import { sellers } from '@/features/home/data';

export function VerifiedSellers() {
  return (
    <View className="mt-8 w-full">
      {/* Header */}
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <Icon name="badge-check" size={22} color="#DBB42C" />
          <Text variant="title-3" className="text-ink-800 font-bold">
            Verified Sellers
          </Text>
        </View>
        <Text variant="subheadline" emphasized className="text-gold-500">View all</Text>
      </View>

      {/* Cards rail */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {sellers.map(seller => (
          <View
            key={seller.id}
            className="w-[300px] rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm"
          >
            {/* Shop header */}
            <View className="flex-row items-center gap-3">
              <View className="border-gold-400 rounded-full border-2 p-px">
                <Image
                  source={seller.avatar}
                  contentFit="cover"
                  className="size-12 rounded-full"
                />
              </View>
              <View className="flex-1">
                <Text
                  variant="callout"
                  emphasized
                  className="text-ink-800"
                  numberOfLines={1}
                >
                  {seller.name}
                </Text>
                <View className="mt-0.5 flex-row items-center gap-1.5">
                  <Rating value={seller.rating} />
                  <Text variant="caption-1" className="text-neutral-400">·</Text>
                  <Text variant="caption-1" className="text-neutral-500">
                    {seller.reviews}
                  </Text>
                </View>
              </View>
              <Icon name="circle-check-big" size={22} color="#DBB42C" />
            </View>

            {/* Category badge */}
            <View className="mt-3 self-start rounded-full bg-neutral-100 px-2.5 py-1">
              <Text variant="caption-1" emphasized className="text-neutral-600">
                {seller.category}
              </Text>
            </View>

            {/* Product grid */}
            <View className="mt-3 flex-row flex-wrap gap-2">
              {seller.products.map(image => (
                <Image
                  key={image}
                  source={image}
                  contentFit="cover"
                  className="aspect-square w-[48%] rounded-xl"
                />
              ))}
            </View>

            {/* Visit shop button */}
            <View className="border-gold-500 bg-gold-50 mt-3 h-[44px] items-center justify-center rounded-xl border">
              <Text variant="subheadline" emphasized className="text-gold-700">
                Visit Shop
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
