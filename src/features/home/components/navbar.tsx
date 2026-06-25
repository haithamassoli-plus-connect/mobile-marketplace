import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { Pressable } from 'react-native';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { LocaleModal } from '@/features/home/components/locale-modal';
import { SupportModal } from '@/features/home/components/support-modal';
import { WishlistModal } from '@/features/home/components/wishlist-modal';
import { nav } from '@/features/home/data';

// Slide (hide/reveal) and cross-fade (black ⇄ blur) timelines.
const HIDE = { duration: 300, easing: Easing.inOut(Easing.quad) } as const;
const FADE = { duration: 220, easing: Easing.out(Easing.quad) } as const;
const ICON_GRAY = '#717680'; // neutral-500 — search placeholder + its icons
const INK = '#252b37'; // ink-800 — action-card icons on white

type Props = {
  /** Slides the bar up off-screen while the user scrolls down. */
  hidden: SharedValue<boolean>;
  /** true near the top → solid black backdrop; false → expo-blur backdrop. */
  atTop: SharedValue<boolean>;
  /** Reports measured height so the screen can offset its scroll content. */
  onHeight: (h: number) => void;
  /** BlurTargetView ref — the content Android samples for the backdrop blur. */
  blurTarget: RefObject<RNView | null>;
};

// Fixed overlay header (Figma 267:5658). Hides on scroll-down, reveals on
// scroll-up with an expo-blur backdrop; solid black at the very top.
// ponytail: the two booleans arrive as shared values and are read via
// useDerivedValue — the whole show/hide + backdrop animation stays on the UI
// thread, so scrolling never re-renders this component.
export function Navbar({ hidden, atTop, onHeight, blurTarget }: Props) {
  const insets = useSafeAreaInsets();
  const navH = useSharedValue(0);
  const support = useModal();
  const wishlist = useModal();
  const locale = useModal();

  const hideP = useDerivedValue<number>(() =>
    withTiming(hidden.value ? 1 : 0, HIDE));
  const topP = useDerivedValue<number>(() =>
    withTiming(atTop.value ? 1 : 0, FADE));

  // GPU-only props (transform + opacity) per animation-gpu-properties.
  const rootStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: -navH.value * hideP.value }],
  }));

  return (
    <Animated.View
      onLayout={(e) => {
        const h = e.nativeEvent.layout.height;
        navH.value = h;
        onHeight(h);
      }}
      style={rootStyle}
      className="absolute inset-x-0 top-0"
    >
      <Backdrop topP={topP} blurTarget={blurTarget} />

      <View className="px-4 pb-5" style={{ paddingTop: insets.top + 8 }}>
        {/* Row 1: logo + action cards */}
        <View className="flex-row items-center justify-between">
          <Image
            source={require('@/components/ui/icons/logo.svg')}
            style={{ width: 88, height: 33 }}
            contentFit="contain"
          />

          <View className="flex-row items-center gap-3">
            {/* Locale switcher — Figma uses a Jordan flag; ponytail: keep a
                globe icon as the dummy substitute (no Figma asset download). */}
            <Pressable
              onPress={() => locale.present()}
              accessibilityRole="button"
              accessibilityLabel="region and language"
              className="h-[34px] flex-row items-center gap-1 rounded-sm border border-neutral-200 bg-white py-2 pr-3 pl-2 shadow-sm active:opacity-80"
            >
              <Icon name="globe" size={18} color={INK} />
              <Text variant="caption-2" emphasized className="text-ink-800">
                {nav.locale}
              </Text>
            </Pressable>

            {/* Support */}
            <Pressable
              onPress={() => support.present()}
              accessibilityRole="button"
              accessibilityLabel="help and support"
              className="h-[34px] w-[33px] items-center justify-center rounded-sm bg-white shadow-sm active:opacity-80"
            >
              <Icon name="headphones" size={20} color={INK} />
            </Pressable>

            {/* Wishlist */}
            <Pressable
              onPress={() => wishlist.present()}
              accessibilityRole="button"
              accessibilityLabel="wishlist"
              className="h-[34px] w-[33px] items-center justify-center rounded-sm border border-secondary-100 bg-white shadow-sm active:opacity-80"
            >
              <Icon name="heart" size={20} color={INK} />
              <View className="absolute -top-1 -right-1 size-[18px] items-center justify-center rounded-full bg-error-500">
                <Text variant="caption-2" emphasized className="text-white">
                  {nav.wishlistCount}
                </Text>
              </View>
            </Pressable>
          </View>
        </View>

        {/* Row 2: search bar */}
        <View className="mt-4 h-[44px] flex-row items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-100 py-1.5 pr-2 pl-4">
          <Icon name="search" size={18} color={ICON_GRAY} />
          <Text
            numberOfLines={1}
            variant="footnote"
            className="flex-1 text-neutral-500"
          >
            {nav.searchPlaceholder}
          </Text>
          <View className="flex-row items-center gap-2.5">
            <Icon name="mic" size={20} color={ICON_GRAY} />
            <Icon name="camera" size={20} color={ICON_GRAY} />
          </View>
        </View>
      </View>

      <LocaleModal ref={locale.ref} />
      <SupportModal ref={support.ref} />
      <WishlistModal ref={wishlist.ref} />
    </Animated.View>
  );
}

// Cross-fading backdrops: solid black at the top, expo-blur once scrolled.
// topP: 1 = solid, 0 = blurred.
function Backdrop({
  topP,
  blurTarget,
}: {
  topP: SharedValue<number>;
  blurTarget: RefObject<RNView | null>;
}) {
  const solidStyle = useAnimatedStyle(() => ({ opacity: topP.value }));
  const blurStyle = useAnimatedStyle(() => ({ opacity: 1 - topP.value }));
  return (
    <>
      <Animated.View
        pointerEvents="none"
        style={solidStyle}
        className="absolute inset-0 bg-secondary-950"
      />
      <Animated.View
        pointerEvents="none"
        style={blurStyle}
        className="absolute inset-0 overflow-hidden"
      >
        {/* blurTarget + dimezisBlurViewSdk31Plus = real blur on Android 12+,
            cheap fallback (no blur) below it; iOS ignores both and blurs live. */}
        <BlurView
          tint="dark"
          intensity={40}
          blurTarget={blurTarget}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={{ flex: 1 }}
        />
        {/* Dark wash keeps the white logo/tagline legible over blurred content. */}
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(2,6,23,0.6)' }}
        />
      </Animated.View>
    </>
  );
}
