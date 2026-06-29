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

const TARGET_W = 26;

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
    const ty = p * dy - 80 * Math.sin(p * Math.PI);
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
