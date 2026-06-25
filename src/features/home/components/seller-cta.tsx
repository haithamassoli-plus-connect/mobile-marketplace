import { Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { sellerCta } from '@/features/home/data';

export function SellerCta() {
  return (
    <View className="bg-ink-900 mx-4 mt-8 overflow-hidden rounded-2xl p-6">
      <View className="bg-gold-500/15 absolute -top-10 -right-10 size-40 rounded-full" />

      <Text variant="caption-1" className="text-gold-500 font-semibold tracking-wider uppercase">
        {sellerCta.eyebrow}
      </Text>
      <Text variant="title-2" emphasized className="mt-2 text-white">
        {sellerCta.title}
      </Text>
      <Text variant="subheadline" className="mt-3 text-white/70">
        {sellerCta.description}
      </Text>

      <View className="mt-5 gap-3">
        {sellerCta.props.map(prop => (
          <View key={prop.label} className="flex-row items-center gap-3">
            <View className="bg-gold-500/15 size-9 items-center justify-center rounded-xl">
              <Icon name={prop.icon} size={20} color="#DBB42C" />
            </View>
            <Text variant="subheadline" className="flex-1 text-white">{prop.label}</Text>
          </View>
        ))}
      </View>

      <View className="bg-gold-500 mt-6 h-12 items-center justify-center rounded-xl">
        <Text variant="callout" className="text-ink-900 font-bold">{sellerCta.cta}</Text>
      </View>
    </View>
  );
}
