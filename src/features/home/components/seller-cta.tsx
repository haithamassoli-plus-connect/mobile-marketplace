import { Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { sellerCta } from '@/features/home/data';

export function SellerCta() {
  return (
    <View className="mx-4 mt-8 overflow-hidden rounded-2xl bg-ink-900 p-6">
      <View className="absolute -top-10 -right-10 size-40 rounded-full bg-gold-500/15" />

      <Text className="text-[12px] font-semibold tracking-wider text-gold-500 uppercase">
        {sellerCta.eyebrow}
      </Text>
      <Text className="mt-2 text-[24px] font-bold text-white">
        {sellerCta.title}
      </Text>
      <Text className="mt-3 text-[14px] text-white/70">
        {sellerCta.description}
      </Text>

      <View className="mt-5 gap-3">
        {sellerCta.props.map(prop => (
          <View key={prop.label} className="flex-row items-center gap-3">
            <View className="size-9 items-center justify-center rounded-xl bg-gold-500/15">
              <Icon name={prop.icon} size={20} color="#DBB42C" />
            </View>
            <Text className="flex-1 text-[15px] text-white">{prop.label}</Text>
          </View>
        ))}
      </View>

      <View className="mt-6 h-12 items-center justify-center rounded-xl bg-gold-500">
        <Text className="text-[16px] font-bold text-ink-900">{sellerCta.cta}</Text>
      </View>
    </View>
  );
}
