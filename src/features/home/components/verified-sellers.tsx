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
          <Text className="text-[20px] font-bold text-ink-800">
            Verified Sellers
          </Text>
        </View>
        <Text className="text-[14px] font-semibold text-gold-500">View all</Text>
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
            className="w-[300px] rounded-2xl border border-[#e9eaeb] bg-white p-4 shadow-sm"
          >
            {/* Shop header */}
            <View className="flex-row items-center gap-3">
              <View className="rounded-full border-2 border-gold-400 p-px">
                <Image
                  source={seller.avatar}
                  contentFit="cover"
                  className="size-12 rounded-full"
                />
              </View>
              <View className="flex-1">
                <Text
                  className="text-[16px] font-semibold text-ink-800"
                  numberOfLines={1}
                >
                  {seller.name}
                </Text>
                <View className="mt-0.5 flex-row items-center gap-1.5">
                  <Rating value={seller.rating} />
                  <Text className="text-neutral-400">·</Text>
                  <Text className="text-[12px] text-neutral-500">
                    {seller.reviews}
                  </Text>
                </View>
              </View>
              <Icon name="circle-check-big" size={22} color="#DBB42C" />
            </View>

            {/* Category badge */}
            <View className="mt-3 self-start rounded-full bg-neutral-100 px-2.5 py-1">
              <Text className="text-[12px] font-medium text-neutral-600">
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
            <View className="mt-3 h-[44px] items-center justify-center rounded-xl border border-gold-500 bg-gold-50">
              <Text className="text-[15px] font-semibold text-gold-700">
                Visit Shop
              </Text>
            </View>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
