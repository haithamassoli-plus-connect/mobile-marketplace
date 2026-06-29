import { Text, View } from '@/components/ui';
import { BottomNav } from '@/features/home/components/bottom-nav';

export default function CartScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50">
      <Text variant="callout" className="font-medium text-neutral-500">Cart</Text>
      <BottomNav />
    </View>
  );
}
