import { Text, View } from '@/components/ui';
import { BottomNav } from '@/features/home/components/bottom-nav';

// ponytail: empty placeholder — real content lands in a feature module later.
export default function CategoriesScreen() {
  return (
    <View className="flex-1 items-center justify-center bg-neutral-50">
      <Text variant="callout" className="font-medium text-neutral-500">Categories</Text>
      <BottomNav />
    </View>
  );
}
