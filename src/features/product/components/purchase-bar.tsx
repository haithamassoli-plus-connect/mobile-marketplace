import { memo, useState } from 'react';
import Animated, { FadeIn, FadeOut, interpolateColor, useAnimatedStyle, useDerivedValue, withTiming } from 'react-native-reanimated';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);

// C — sticky bottom bar (rendered outside the ScrollView). The primary action
// morphs "Add to cart" -> "Buy now" once the item lands in the cart; the bar is
// presentational and is told `added`/`onAddToCart` by ProductScreen.
// ponytail: Buy-now no-op, no checkout route yet
function noop() {}

function PurchaseBarImpl({
  insetBottom,
  added,
  onAddToCart,
}: {
  insetBottom: number;
  added: boolean;
  onAddToCart: () => void;
}) {
  const [wished, setWished] = useState(false);
  // Tween the background dark -> gold in lockstep with the label crossfade.
  const morph = useDerivedValue(() => withTiming(added ? 1 : 0, { duration: 220 }));
  const bgStyle = useAnimatedStyle(() => ({
    backgroundColor: interpolateColor(morph.get(), [0, 1], ['#181d27', '#dbb42c']),
  }));
  return (
    <View
      className="flex-row items-center gap-3 rounded-t-[24px] border-t border-neutral-200 bg-white px-[14px] pt-4 shadow-sm"
      style={{ paddingBottom: insetBottom + 14 }}
    >
      <AnimatedPressable
        onPress={added ? noop : onAddToCart}
        accessibilityRole="button"
        accessibilityLabel={added ? 'Buy now' : 'Add to cart'}
        style={bgStyle}
        className="h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-xl px-5 shadow-sm"
      >
        {added ? <BuyNowLabel /> : <AddToCartLabel />}
      </AnimatedPressable>
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

// Explicit variant components (not a boolean-toggled single label) — each owns its
// own crossfade so the swap reads as a morph.
function AddToCartLabel() {
  return (
    <Animated.View
      key="add"
      exiting={FadeOut.duration(140)}
      className="flex-row items-center gap-2"
    >
      <Icon name="shopping-cart" size={18} color="#ffffff" />
      <Text variant="callout" emphasized className="text-white">Add to cart</Text>
    </Animated.View>
  );
}

function BuyNowLabel() {
  return (
    <Animated.View
      key="buy"
      entering={FadeIn.duration(220)}
      className="flex-row items-center gap-2"
    >
      <Icon name="zap" size={18} color="#181d27" />
      <Text variant="callout" emphasized className="text-neutral-900">Buy now</Text>
    </Animated.View>
  );
}

export const PurchaseBar = memo(PurchaseBarImpl);

export default PurchaseBar;
