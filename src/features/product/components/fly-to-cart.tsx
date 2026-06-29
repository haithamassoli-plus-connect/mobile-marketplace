import { useEffect } from 'react';
import Animated, {
  Easing,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';

import { Image } from '@/components/ui';

type Rect = { x: number; y: number; width: number; height: number };

// Presentational overlay: renders a shrinking copy of the gallery image flying
// along an arc from `start` to `end`. Mounted only while a flight is in progress;
// owns no cart/label state — it just reports `onLand` when the timing finishes.
const TARGET_W = 26; // cart icon footprint we shrink down to

export function FlyToCart({
  source,
  start,
  end,
  onLand,
}: {
  source: string;
  start: Rect;
  end: { x: number; y: number };
  onLand: () => void;
}) {
  const progress = useSharedValue(0);

  // Mutate .value in the effect (memory rule): never inside useCallback/useMemo.
  // `onLand` is stable (useCallback in the parent) so this runs once, on mount.
  useEffect(() => {
    progress.set(
      withTiming(1, { duration: 600, easing: Easing.inOut(Easing.cubic) }, (fin) => {
        if (fin)
          runOnJS(onLand)();
      }),
    );
  }, [onLand, progress]);

  const style = useAnimatedStyle(() => {
    const p = progress.get();
    const dx = end.x - (start.x + start.width / 2);
    const dy = end.y - (start.y + start.height / 2);
    const tx = p * dx;
    const ty = p * dy - 80 * Math.sin(p * Math.PI); // slight upward arc
    const scale = interpolate(p, [0, 1], [1, TARGET_W / start.width]);
    const opacity = interpolate(p, [0, 0.65, 1], [1, 1, 0]);
    return { transform: [{ translateX: tx }, { translateY: ty }, { scale }], opacity };
  });

  return (
    <Animated.View
      pointerEvents="none"
      accessibilityElementsHidden
      importantForAccessibility="no-hide-descendants"
      className="absolute inset-0"
    >
      <Animated.View
        style={[
          { position: 'absolute', left: start.x, top: start.y, width: start.width, height: start.height },
          style,
        ]}
      >
        <Image source={source} contentFit="contain" className="size-full rounded-2xl" />
      </Animated.View>
    </Animated.View>
  );
}
