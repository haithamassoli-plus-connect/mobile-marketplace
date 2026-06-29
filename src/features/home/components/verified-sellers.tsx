import { Button, Image, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { sellers } from '@/features/home/data';

const PRICES = [99, 79, 49, 15];

export function VerifiedSellers() {
  return (
    <View className="mt-8 w-full gap-4">
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <Icon name="store" size={24} color="#DBB42C" />
          <Text variant="title-3" emphasized className="text-ink-900">
            Verified Sellers
          </Text>
        </View>
        <Text variant="footnote" emphasized className="text-gold-500">
          View all
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 16 }}
      >
        {sellers.map(seller => (
          <View
            key={seller.id}
            className="w-[330px] gap-4 overflow-hidden rounded-2xl border border-neutral-200 bg-white p-4 shadow-lg"
          >
            <View className="flex-row items-center gap-3">
              <View className="size-12 items-center justify-center overflow-hidden rounded-full border-2 border-gold-500">
                <Image
                  source={seller.avatar}
                  contentFit="cover"
                  className="size-10 rounded-full"
                />
              </View>
              <View className="flex-1 gap-1">
                <Text
                  variant="subheadline"
                  emphasized
                  className="text-ink-900"
                  numberOfLines={1}
                >
                  {seller.name}
                </Text>
                <View className="flex-row items-center gap-1.5">
                  <Icon name="star" size={12} color="#DBB42C" />
                  <Text variant="caption-1" emphasized className="text-ink-900">
                    {seller.rating.toFixed(1)}
                  </Text>
                  <Text variant="caption-1" className="text-neutral-500">·</Text>
                  <Text variant="caption-1" className="text-neutral-500">
                    {seller.reviews}
                  </Text>
                </View>
              </View>
              <Icon name="badge-check" size={24} color="#DBB42C" />
            </View>

            <View className="self-start rounded-full bg-gold-500 px-2.5 py-[3px]">
              <Text variant="caption-1" emphasized className="text-ink-950">
                {seller.category}
              </Text>
            </View>

            <View className="gap-2">
              {[0, 1].map(row => (
                <View key={row} className="flex-row gap-2">
                  {seller.products.slice(row * 2, row * 2 + 2).map((image, col) => (
                    <View
                      key={image}
                      className="h-[145px] flex-1 justify-end overflow-hidden rounded-xl p-2"
                    >
                      <Image
                        source={image}
                        contentFit="cover"
                        className="absolute inset-0 size-full"
                      />
                      <View className="self-start rounded-lg bg-black/72 px-2 py-1">
                        <Text variant="caption-1" emphasized className="text-white">
                          {`JOD ${PRICES[row * 2 + col]}`}
                        </Text>
                      </View>
                    </View>
                  ))}
                </View>
              ))}
            </View>

            <Button
              variant="ghost"
              className="my-0 h-auto px-0 items-center justify-center rounded-[10px] border border-neutral-300 bg-white py-3"
            >
              <Text variant="subheadline" emphasized className="text-ink-900">
                Visit Shop
              </Text>
            </Button>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
