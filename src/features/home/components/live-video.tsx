import { Image, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { live } from '@/features/home/data';

export function LiveVideo() {
  return (
    <View className="relative mx-4 mt-8 h-[420px] overflow-hidden rounded-2xl">
      {/* Background stream */}
      <Image
        source={live.image}
        contentFit="cover"
        className="absolute inset-0 size-full"
      />
      {/* Scrims */}
      <View className="absolute inset-0 bg-black/25" />
      <View className="absolute inset-x-0 bottom-0 h-2/5 bg-black/55" />

      {/* Top bar */}
      <View className="absolute inset-x-3 top-3 flex-row items-center justify-between">
        {/* LIVE pill */}
        <View className="flex-row items-center gap-1 rounded-full bg-red-600 px-2.5 py-1">
          <View className="size-1.5 rounded-full bg-white" />
          <Text variant="caption-2" className="font-bold text-white">{live.badge}</Text>
        </View>
        {/* Viewers pill */}
        <View className="flex-row items-center gap-1 rounded-full bg-black/40 px-2.5 py-1">
          <Icon name="eye" size={12} color="#ffffff" />
          <Text variant="caption-2" className="text-white">{live.viewers}</Text>
        </View>
      </View>

      {/* Bottom content */}
      <View className="absolute inset-x-3 bottom-3">
        <Text
          variant="headline"
          className="font-bold text-white"
          numberOfLines={2}
        >
          {live.title}
        </Text>

        <View className="mt-2 flex-row items-center gap-2">
          <Icon name="store" size={14} color="#DBB42C" />
          <Text variant="footnote" className="text-white/90">{live.host}</Text>
        </View>

        {/* Mini product chips */}
        <View className="mt-3 flex-row gap-2">
          {live.products.map(product => (
            <View
              key={product.id}
              className="flex-row items-center gap-1.5 rounded-xl bg-white/90 p-1"
            >
              <Image
                source={product.image}
                contentFit="cover"
                className="size-8 rounded-lg"
              />
              <View>
                <Text
                  variant="caption-2"
                  emphasized
                  className="text-ink-800"
                  numberOfLines={1}
                >
                  {product.title}
                </Text>
                <Text variant="caption-2" className="text-gold-600 font-bold">
                  {`$ ${product.price}`}
                </Text>
              </View>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
}
