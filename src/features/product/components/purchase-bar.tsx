import { useState } from 'react';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

// C — sticky bottom bar (rendered outside the ScrollView). Dark "Add to cart"
// action + the wishlist toggle (moved here from the gallery).
export function PurchaseBar({ insetBottom }: { insetBottom: number }) {
  const [wished, setWished] = useState(false);
  return (
    <View
      className="flex-row items-center gap-3 rounded-t-[24px] border-t border-neutral-200 bg-white px-[14px] pt-4 shadow-sm"
      style={{ paddingBottom: insetBottom + 14 }}
    >
      {/* ponytail: decorative — no cart store yet. */}
      <Pressable className="h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-xl bg-neutral-900 px-5 shadow-sm">
        <Icon name="shopping-cart" size={18} color="#ffffff" />
        <Text variant="callout" emphasized className="text-white">Add to cart</Text>
      </Pressable>
      {/* ponytail: local wishlist toggle — moved from the gallery; no store yet. */}
      <Pressable
        onPress={() => setWished(v => !v)}
        accessibilityRole="button"
        accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}
        className="size-[50px] items-center justify-center rounded-[10px] border border-neutral-200 bg-white shadow-sm"
      >
        <Icon name="heart" size={24} color={wished ? '#dbb42c' : '#181d27'} />
      </Pressable>
    </View>
  );
}
