import { Image, ScrollView, Text, View } from '@/components/ui';
import { trustedBrands } from '@/features/home/data';

export function TrustedBrands() {
  return (
    <View className="mt-8 w-full">
      <View className="items-center px-4">
        <Text className="text-[20px] font-bold text-ink-800">
          {trustedBrands.title}
        </Text>
        <Text className="mt-1 text-[14px] text-neutral-500">
          {trustedBrands.subtitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        className="mt-4"
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {trustedBrands.brands.map(brand => (
          <View
            key={brand.id}
            className="h-16 w-[120px] items-center justify-center overflow-hidden rounded-2xl border border-[#e9eaeb] bg-white p-2 shadow-sm"
          >
            <Image
              source={brand.logo}
              contentFit="cover"
              className="size-10 rounded-lg"
            />
            <Text
              numberOfLines={1}
              className="mt-1 text-[12px] font-semibold text-ink-800"
            >
              {brand.name}
            </Text>
          </View>
        ))}
      </ScrollView>
    </View>
  );
}
