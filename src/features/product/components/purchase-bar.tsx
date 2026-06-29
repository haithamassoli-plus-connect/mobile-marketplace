import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

// C — sticky bottom bar (rendered outside the ScrollView). Two actions only: the
// stepper lives in the purchase panel and the wishlist toggle in the gallery.
export function PurchaseBar({ insetBottom }: { insetBottom: number }) {
  return (
    <View
      className="gap-3 rounded-t-[24px] border-t border-neutral-200 bg-white px-[14px] pt-4 shadow-sm"
      style={{ paddingBottom: insetBottom + 14 }}
    >
      <View className="flex-row items-center gap-2.5">
        {/* ponytail: decorative — no cart store yet. */}
        <Pressable className="h-[52px] flex-[1.3] flex-row items-center justify-center gap-2.5 rounded-full bg-neutral-900">
          <Icon name="shopping-cart" size={22} color="#ffffff" />
          <Text variant="callout" emphasized className="text-white">Add to cart</Text>
        </Pressable>
        {/* ponytail: decorative — no checkout yet. */}
        <Pressable className="h-[52px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gold-500">
          <Icon name="zap" size={20} color="#0a0d12" />
          <Text variant="callout" emphasized className="text-neutral-950">Buy it now</Text>
        </Pressable>
      </View>
    </View>
  );
}
