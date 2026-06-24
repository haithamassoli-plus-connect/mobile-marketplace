import { useState } from 'react';
import Animated, {
  FadeInDown,
  FadeOutDown,
  LinearTransition,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Pressable, Text, View } from '@/components/ui';

import { Icon } from './icon';

// ponytail: presentational floating tab bar (Figma 98:4507 default / 361:4781 mini).
// Tabs don't route — they mirror the marketplace design. Filled icon = active,
// outline = inactive (the SVGs already carry the right colors, so no tinting).
type Tab = {
  key: string;
  label: string;
  filled: number;
  outline: number;
  dot?: boolean;
};

const TABS: Tab[] = [
  {
    key: 'home',
    label: 'Home',
    filled: require('@/components/ui/icons/bottom-tabs/home-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/home-outline.svg'),
  },
  {
    key: 'categories',
    label: 'Categories',
    filled: require('@/components/ui/icons/bottom-tabs/categories-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/categories-outline.svg'),
  },
  {
    key: 'live',
    label: 'Live',
    dot: true,
    filled: require('@/components/ui/icons/bottom-tabs/tv-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/tv-outline.svg'),
  },
  {
    key: 'cart',
    label: 'Cart',
    filled: require('@/components/ui/icons/bottom-tabs/cart-filled.svg'),
    outline: require('@/components/ui/icons/bottom-tabs/cart-outline.svg'),
  },
  {
    key: 'account',
    label: 'Account',
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
  const [active, setActive] = useState('home');

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 items-center"
      style={{ paddingBottom: insets.bottom + 8 }}
    >
      <View pointerEvents="box-none" className="relative w-full items-center">
        {showScrollTop && !mini
          ? <ScrollTopHandle onPress={onScrollToTop} />
          : null}

        {/* Pill — morphs between default and mini via layout animation. */}
        <Animated.View
          layout={LinearTransition.duration(220)}
          style={PILL_SHADOW}
          className={
            mini
              ? 'flex-row items-center gap-[18px] self-center rounded-[22px] border border-[#eef0f3] bg-white px-3.5 py-2'
              : 'mx-4 flex-row items-center justify-between self-stretch rounded-[28px] border border-[#eef0f3] bg-white px-4 py-2.5'
          }
        >
          {TABS.map(tab => (
            <TabButton
              key={tab.key}
              tab={tab}
              active={active === tab.key}
              mini={mini}
              onPress={() => setActive(tab.key)}
            />
          ))}
        </Animated.View>
      </View>
    </View>
  );
}

function TabButton({
  tab,
  active,
  mini,
  onPress,
}: {
  tab: Tab;
  active: boolean;
  mini: boolean;
  onPress: () => void;
}) {
  const size = mini ? 20 : 24;
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      accessibilityState={{ selected: active }}
      className="items-center gap-1"
    >
      <View className="relative" style={{ width: size, height: size }}>
        <Image
          source={active ? tab.filled : tab.outline}
          style={{ width: size, height: size }}
          contentFit="contain"
        />
        {tab.dot
          ? (
              <View className="absolute -top-0.5 -right-1 size-[7px] rounded-full border border-white bg-error-500" />
            )
          : null}
      </View>
      {mini
        ? null
        : (
            <Text
              className={
                active
                  ? 'text-[10px] font-semibold text-neutral-900'
                  : 'text-[10px] font-medium text-[#8a909c]'
              }
            >
              {tab.label}
            </Text>
          )}
    </Pressable>
  );
}

const GOLD_SHADOW = {
  shadowColor: '#9a7b10',
  shadowOpacity: 0.3,
  shadowRadius: 8,
  shadowOffset: { width: 0, height: 4 },
  elevation: 8,
} as const;

// Gold backdrop with a centered dome "tab" + white chevron (Figma 233:5078),
// peeking up from behind the pill. The dome is a circle whose lower half the bar
// paints over, so the two gold pieces read as one shape.
function ScrollTopHandle({ onPress }: { onPress?: () => void }) {
  return (
    <Animated.View
      entering={FadeInDown.duration(220)}
      exiting={FadeOutDown.duration(180)}
      pointerEvents="box-none"
      // ponytail: top offset eyeballed from Figma — nudge if the gold peek/dome looks off.
      className="absolute inset-x-4 items-center"
      style={{ top: -24 }}
    >
      <Pressable
        onPress={onPress}
        hitSlop={16}
        accessibilityRole="button"
        accessibilityLabel="Scroll to top"
        className="w-full items-center"
      >
        <View pointerEvents="none" className="w-full items-center">
          <View
            className="size-12 rounded-full bg-primary-500"
            style={GOLD_SHADOW}
          />
          <View
            className="-mt-[32px] h-10 w-full rounded-[28px] bg-primary-500"
            style={GOLD_SHADOW}
          />
        </View>
        <View
          pointerEvents="none"
          className="absolute inset-x-0 top-2 items-center"
        >
          <Icon name="chevron-up" size={16} color="#ffffff" />
        </View>
      </Pressable>
    </Animated.View>
  );
}
