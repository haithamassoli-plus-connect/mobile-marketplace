import type { Href } from 'expo-router';
import type { SharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { router, usePathname } from 'expo-router';
import { useEffect } from 'react';
import { useWindowDimensions } from 'react-native';
import Animated, {
  Easing,
  FadeOutDown,
  interpolate,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
  ZoomIn,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Image, Pressable, Text, View } from '@/components/ui';

// ponytail: floating tab bar (Figma 98:4507 default / 361:4781 mini). Routes via
// expo-router — the active tab is derived from the current path. Filled icon =
// active, outline = inactive (the SVGs already carry the right colors, no tinting).
type Tab = {
  key: string;
  label: string;
  route: Href;
  filled: number;
  outline: number;
  dot?: boolean;
};

const TABS: Tab[] = [
  {
    key: 'home',
    label: 'Home',
    route: '/',
    filled: require('@/components/ui/icons/bottom-tabs/home-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/home-outline.svg'),
  },
  {
    key: 'categories',
    label: 'Categories',
    route: '/categories',
    filled: require('@/components/ui/icons/bottom-tabs/categories-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/categories-outline.svg'),
  },
  {
    key: 'live',
    label: 'Live',
    route: '/live',
    dot: true,
    filled: require('@/components/ui/icons/bottom-tabs/tv-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/tv-outline.svg'),
  },
  {
    key: 'cart',
    label: 'Cart',
    route: '/cart',
    filled: require('@/components/ui/icons/bottom-tabs/cart-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/cart-outline.svg'),
  },
  {
    key: 'account',
    label: 'Account',
    route: '/profile',
    filled: require('@/components/ui/icons/bottom-tabs/profile-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/profile-outline.svg'),
  },
];

// Two-layer drop shadow from the Figma pill.
const PILL_SHADOW = {
  shadowColor: '#0f1729',
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 8 },
  elevation: 12,
} as const;

// Default ⇄ mini morph driven by one shared value, so the whole pill moves on a
// single 350ms ease-in-out timeline. No LinearTransition snapshot + a stable tree
// (labels stay mounted, just collapsed) means no ghosting/afterimage.
const MORPH = { duration: 350, easing: Easing.inOut(Easing.quad) } as const;
const MINI_W = 220; // ponytail: mini pill width; eyeball-tune to Figma 361:4781.
const LABEL_H = 13; // caption-2 line height (text.tsx: leading-[13px]).

type Props = {
  /** Shrinks to the icon-only pill (set while scrolling down). */
  mini?: boolean;
  /** Show the scroll-to-top handle (only honored in the default, non-mini state). */
  showScrollTop?: boolean;
  onScrollToTop?: () => void;
};

export function BottomNav({
  mini = false,
  showScrollTop = false,
  onScrollToTop,
}: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width: winW } = useWindowDimensions();
  const active = TABS.find(tab => tab.route === pathname)?.key ?? 'home';

  // 0 = expanded, 1 = mini. Seeded to the current state so the first paint isn't
  // animated; every later toggle eases over MORPH (same curve both directions).
  const p = useSharedValue(mini ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(mini ? 1 : 0, MORPH);
  }, [mini, p]);

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(p.value, [0, 1], [winW - 38, MINI_W]), // mx-4 → compact
    paddingHorizontal: interpolate(p.value, [0, 1], [16, 14]), // px-4 → px-3.5
    paddingVertical: interpolate(p.value, [0, 1], [10, 8]), // py-2.5 → py-2
    borderRadius: interpolate(p.value, [0, 1], [28, 22]),
  }), [winW]);

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 items-center"
    >
      {/* Progressive backdrop blur behind the pill (Figma "Background blur bottom nav").
          Shrinks with the pill (same `p` timeline). */}
      <ProgressiveBlur
        p={p}
        expandedHeight={insets.bottom + 132}
        miniHeight={insets.bottom + 84}
      />

      <View
        pointerEvents="box-none"
        className="relative w-full items-center"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        {showScrollTop && !mini
          ? <ScrollTopHandle onPress={onScrollToTop} pillWidth={winW - 32} />
          : null}

        {/* Pill — morphs between default and mini off the shared `p` value. */}
        <Animated.View
          style={[PILL_SHADOW, containerStyle, { alignSelf: 'center' }]}
          className="flex-row items-center border border-[#eef0f3] bg-white"
        >
          {TABS.map(tab => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={active === tab.key}
              p={p}
              onPress={() => router.navigate(tab.route)}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

// Figma "Background blur bottom nav": blur ramps 0 → ~45px, top → bottom. expo-blur
// has no gradient, so approximate it by stacking equal light bands each pinned to the
// bottom with a higher top edge — overlap count grows downward, giving a near-linear
// ramp (iOS compounds stacked blurs; Android approximates).
// ponytail: 6 fixed bands; bump BANDS or switch to MaskedView + gradient if it bands.
const BLUR_BANDS = 8;
const BLUR_INTENSITY = 13; // per band; ≈×6 at the very bottom

// Band tops are percentages so they scale when the container height animates between
// the expanded and mini heights (driven by `p`). ponytail: height shrinks the blur
// area; per-band intensity is left constant (animating it needs AnimatedBlurView).
function ProgressiveBlur({
  p,
  expandedHeight,
  miniHeight,
}: {
  p: SharedValue<number>;
  expandedHeight: number;
  miniHeight: number;
}) {
  const heightStyle = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [expandedHeight, miniHeight]),
    // Fade the blur out as the pill goes mini — no backdrop in small mode.
    opacity: interpolate(p.value, [0, 1], [1, 0]),
  }));
  return (
    <Animated.View
      pointerEvents="none"
      style={[{ position: 'absolute', left: 0, right: 0, bottom: 0 }, heightStyle]}
    >
      {Array.from({ length: BLUR_BANDS }, (_, i) => (
        <BlurView
          key={`band-${i}`}
          tint="light"
          intensity={BLUR_INTENSITY}
          style={{
            position: 'absolute',
            left: 0,
            right: 0,
            bottom: 0,
            top: `${(i + 4 / BLUR_BANDS) * 100}%`,
          }}
        />
      ))}
    </Animated.View>
  );
}

function TabButton({
  tab,
  active,
  p,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  p: SharedValue<number>;
  onPress: () => void;
}) {
  const iconStyle = useAnimatedStyle(() => {
    const size = interpolate(p.value, [0, 1], [24, 20]);
    return { width: size, height: size };
  });
  // Collapse the label (height + its 4px gap) and fade it out in lockstep with the
  // pill so the row height follows intrinsically — no popping, no afterimage.
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 1], [1, 0]),
    height: interpolate(p.value, [0, 1], [LABEL_H, 0]),
    marginTop: interpolate(p.value, [0, 1], [4, 0]),
  }));

  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className="flex-1 items-center"
    >
      <Animated.View className="relative" style={iconStyle}>
        <Image
          source={active ? tab.filled : tab.outline}
          style={{ width: '100%', height: '100%' }}
          contentFit="contain"
        />
        {tab.dot
          ? (
              <View className="absolute -top-0.5 -right-1 size-[7px] rounded-full border border-white bg-error-500" />
            )
          : null}
      </Animated.View>
      <Animated.View style={[labelStyle, { overflow: 'hidden' }]}>
        <Text
          variant="caption-2"
          numberOfLines={1}
          emphasized={active}
          className={active ? 'text-neutral-900' : 'font-medium text-[#8a909c]'}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Pressable>
  );
}

const GOLD = '#dbb42c'; // primary-500

// Scroll-to-top handle (Figma 233:5078): a gold rounded card with a gentle center
// hump + white chevron, sitting BEHIND the pill so only the top band and hump peek
// above. Drawn as one SVG path so the hump blends seamlessly into the card; the
// chevron is a second path inside the same viewBox so it tracks the hump at any
// scale. ViewBox units mirror the Figma pixel grid.
const GOLD_VB_W = 396;
const GOLD_VB_H = 81;
const GOLD_PATH
  = 'M0,38 A22,22 0 0 1 22,16 L154,16 C168,-2 228,-2 242,16 L374,16 '
    + 'A22,22 0 0 1 396,38 L396,81 L0,81 Z';
const CHEVRON_PATH = 'M189,15 L198,7 L207,15';

const GOLD_SHADOW = {
  shadowColor: '#9a7b10',
  shadowOpacity: 0.22,
  shadowRadius: 7,
  shadowOffset: { width: 0, height: 4 },
  elevation: 6,
} as const;

function ScrollTopHandle({
  onPress,
  pillWidth,
}: {
  onPress?: () => void;
  pillWidth: number;
}) {
  // Gold is inset ~6% from the pill so the pill's white corners sit proud of it.
  const w = pillWidth * 0.936;
  const h = (w * GOLD_VB_H) / GOLD_VB_W;
  // Lift so the shoulder (vb y16) clears the pill top by the rise (vb 14); the rest
  // tucks behind the pill. top = -(16+14)/vbW · w collapses the viewBox math.
  const top = -(w * 30) / GOLD_VB_W;

  return (
    // Enter: ZoomIn on the MORPH curve — the handle grows out of the pill, in
    // lockstep with the nav expanding mini→full.
    // Exit: NOT ZoomOut. An unmounting view is frozen by Reanimated at its old
    // position while the nav shrinks (its top drops ~25px), so a scale-to-center
    // would leave the handle floating above the now-smaller nav. FadeOutDown slides
    // down 25px (≈ that exact drop) + fades, so it tucks away with the shrink.
    <Animated.View
      entering={ZoomIn.duration(MORPH.duration).easing(MORPH.easing)}
      exiting={FadeOutDown.duration(200)}
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center"
      style={{ top }}
    >
      <Pressable
        onPress={onPress}
        hitSlop={16}
        accessibilityRole="button"
        accessibilityLabel="Scroll to top"
      >
        <Svg
          width={w}
          height={h}
          viewBox={`0 0 ${GOLD_VB_W} ${GOLD_VB_H}`}
          style={GOLD_SHADOW}
        >
          <Path d={GOLD_PATH} fill={GOLD} />
          <Path
            d={CHEVRON_PATH}
            stroke="#ffffff"
            strokeWidth={3}
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="none"
          />
        </Svg>
      </Pressable>
    </Animated.View>
  );
}
