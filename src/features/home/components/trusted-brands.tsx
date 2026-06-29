import { Image, ScrollView, Text, View } from '@/components/ui';
import { trustedBrands } from '@/features/home/data';

export function TrustedBrands() {
  return (
    <View className="w-full gap-6 bg-white py-8">
      <View className="items-center gap-1.5 px-4">
        <Text variant="title-2" emphasized className="text-center text-ink-900">
          {trustedBrands.title}
        </Text>
        <Text variant="subheadline" className="text-center text-neutral-500">
          {trustedBrands.subtitle}
        </Text>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {trustedBrands.brands.map(brand => (
          <View
            key={brand.id}
            style={chipShadow}
            className="size-16 items-center justify-center overflow-hidden rounded-2xl border border-neutral-200 bg-white"
          >
            <Image
              source={brand.logo}
              accessibilityLabel={brand.name}
              contentFit="contain"
              className="size-12 rounded-[10px]"
            />
          </View>
        ))}
      </ScrollView>
    </View>
  );
}

const chipShadow = {
  shadowColor: '#333359',
  shadowOpacity: 0.18,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 6 },
  elevation: 8,
};
