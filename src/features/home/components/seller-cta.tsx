import { Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { sellerCta } from '@/features/home/data';

export function SellerCta() {
  return (
    <View className="mx-4 mt-8">
      <View className="overflow-hidden rounded-2xl bg-secondary-950 px-6 py-7">
        <View className="absolute -top-12 -right-12 size-44 rounded-full bg-gold-500/15" />

        <Text variant="caption-1" emphasized className="text-gold-500">
          {sellerCta.eyebrow}
        </Text>
        <Text variant="title-2" emphasized className="mt-2.5 text-white">
          {sellerCta.title}
        </Text>
        <Text variant="subheadline" className="mt-2.5 text-white/78">
          {sellerCta.description}
        </Text>

        <View className="mt-3 gap-3.5">
          {sellerCta.props.map(prop => (
            <View key={prop.label} className="flex-row items-center gap-3">
              <View className="size-9 items-center justify-center rounded-full bg-gold-500">
                <Icon name={prop.icon} size={20} color="#0a0909" />
              </View>
              <Text variant="subheadline" emphasized className="flex-1 text-white">
                {prop.label}
              </Text>
            </View>
          ))}
        </View>

        <View className="mt-6 h-12 items-center justify-center rounded-xl bg-gold-500">
          <Text variant="headline" className="text-ink-950">
            {sellerCta.cta}
          </Text>
        </View>
      </View>
    </View>
  );
}
