import type { Href } from 'expo-router';
import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
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

import { Button, Image, Text, View } from '@/components/ui';

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
    key: 'showcase',
    label: 'Showcase',
    route: '/showcase',
    filled: require('@/components/ui/icons/bottom-tabs/showcase-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/showcase-outline.svg'),
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

const PILL_SHADOW = {
  shadowColor: '#0f1729',
  shadowOpacity: 0.14,
  shadowRadius: 14,
  shadowOffset: { width: 0, height: 10 },
  elevation: 12,
} as const;

const MORPH = { duration: 350, easing: Easing.inOut(Easing.quad) } as const;
const MINI_W = 220;
const LABEL_H = 12;

const SHOW_SCROLL_TOP_HANDLE = false;

type Props = {
  mini?: boolean;
  showScrollTop?: boolean;
  onScrollToTop?: () => void;
  blurTarget?: RefObject<RNView | null>;
};

export function BottomNav({
  mini = false,
  showScrollTop = false,
  onScrollToTop,
  blurTarget,
}: Props) {
  const insets = useSafeAreaInsets();
  const pathname = usePathname();
  const { width: winW } = useWindowDimensions();
  const active = TABS.find(tab => tab.route === pathname)?.key ?? 'home';

  const p = useSharedValue(mini ? 1 : 0);
  useEffect(() => {
    p.value = withTiming(mini ? 1 : 0, MORPH);
  }, [mini, p]);

  const containerStyle = useAnimatedStyle(() => ({
    width: interpolate(p.value, [0, 1], [winW - 38, MINI_W]),
    paddingHorizontal: interpolate(p.value, [0, 1], [16, 14]),
    paddingVertical: interpolate(p.value, [0, 1], [10, 8]),
    borderRadius: interpolate(p.value, [0, 1], [28, 22]),
  }), [winW]);

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 items-center"
    >
      <ProgressiveBlur
        p={p}
        blurTarget={blurTarget}
        expandedHeight={insets.bottom + 132}
        miniHeight={insets.bottom + 84}
      />

      <View
        pointerEvents="box-none"
        className="relative w-full items-center"
        style={{ paddingBottom: insets.bottom + 8 }}
      >
        {SHOW_SCROLL_TOP_HANDLE && showScrollTop && !mini
          ? <ScrollTopHandle onPress={onScrollToTop} pillWidth={winW - 32} />
          : null}

        <Animated.View
          style={[PILL_SHADOW, containerStyle, { alignSelf: 'center' }]}
          className="flex-row items-center border border-neutral-200 bg-white"
        >
          {TABS.map(tab => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={active === tab.key}
              p={p}
              onPress={() => {
                if (active === tab.key) {
                  onScrollToTop?.();
                  return;
                }
                router.navigate(tab.route);
              }}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

const BLUR_BANDS = 8;
const BLUR_INTENSITY = 13;

function ProgressiveBlur({
  p,
  blurTarget,
  expandedHeight,
  miniHeight,
}: {
  p: SharedValue<number>;
  blurTarget?: RefObject<RNView | null>;
  expandedHeight: number;
  miniHeight: number;
}) {
  const heightStyle = useAnimatedStyle(() => ({
    height: interpolate(p.value, [0, 1], [expandedHeight, miniHeight]),
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
          blurTarget={blurTarget}
          blurMethod="dimezisBlurViewSdk31Plus"
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
  const labelStyle = useAnimatedStyle(() => ({
    opacity: interpolate(p.value, [0, 1], [1, 0]),
    height: interpolate(p.value, [0, 1], [LABEL_H, 0]),
    marginTop: interpolate(p.value, [0, 1], [4, 0]),
  }));

  return (
    <Button
      variant="ghost"
      className="my-0 h-auto flex-col px-0 flex-1 items-center"
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
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
          numberOfLines={1}
          className={`text-[10px] leading-[12px] ${
            active
              ? 'font-semibold text-neutral-900'
              : 'font-medium text-neutral-500'
          }`}
        >
          {tab.label}
        </Text>
      </Animated.View>
    </Button>
  );
}

const GOLD = '#dbb42c';

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
  const w = pillWidth * 0.936;
  const h = (w * GOLD_VB_H) / GOLD_VB_W;
  const top = -(w * 30) / GOLD_VB_W;

  return (
    <Animated.View
      entering={ZoomIn.duration(MORPH.duration).easing(MORPH.easing)}
      exiting={FadeOutDown.duration(200)}
      pointerEvents="box-none"
      className="absolute inset-x-0 items-center"
      style={{ top }}
    >
      <Button
        variant="ghost"
        className="my-0 h-auto p-0"
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
      </Button>
    </Animated.View>
  );
}
