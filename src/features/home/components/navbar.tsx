import type { RefObject } from 'react';
import type { View as RNView } from 'react-native';
import type { SharedValue } from 'react-native-reanimated';
import { BlurView } from 'expo-blur';
import { router } from 'expo-router';
import Animated, {
  Easing,
  useAnimatedStyle,
  useDerivedValue,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { LocaleModal } from '@/features/home/components/locale-modal';
import { SupportModal } from '@/features/home/components/support-modal';
import { WishlistModal } from '@/features/home/components/wishlist-modal';
import { nav } from '@/features/home/data';

const HIDE = { duration: 300, easing: Easing.inOut(Easing.quad) } as const;
const FADE = { duration: 220, easing: Easing.out(Easing.quad) } as const;
const ICON_GRAY = '#717680';
const INK = '#252b37';

type Props = {
  hidden: SharedValue<boolean>;
  atTop: SharedValue<boolean>;
  onHeight: (h: number) => void;
  blurTarget: RefObject<RNView | null>;
};

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
        <View className="flex-row items-center justify-between">
          <Image
            source={require('@/components/ui/icons/logo.svg')}
            style={{ width: 88, height: 33 }}
            contentFit="contain"
          />

          <View className="flex-row items-center gap-3">
            <Button
              variant="ghost"
              onPress={() => locale.present()}
              accessibilityRole="button"
              accessibilityLabel="region and language"
              className="my-0 h-[34px] flex-row items-center gap-1 rounded-sm border border-neutral-200 bg-white py-2 pr-3 pl-2 shadow-sm active:opacity-80"
            >
              <Icon name="globe" size={18} color={INK} />
              <Text variant="caption-2" emphasized className="text-ink-800">
                {nav.locale}
              </Text>
            </Button>

            <Button
              variant="ghost"
              onPress={() => support.present()}
              accessibilityRole="button"
              accessibilityLabel="help and support"
              className="my-0 h-[34px] w-[33px] items-center justify-center rounded-sm bg-white px-0 shadow-sm active:opacity-80"
            >
              <Icon name="headphones" size={20} color={INK} />
            </Button>

            <Button
              variant="ghost"
              onPress={() => wishlist.present()}
              accessibilityRole="button"
              accessibilityLabel="wishlist"
              className="my-0 h-[34px] w-[33px] items-center justify-center rounded-sm border border-secondary-100 bg-white px-0 shadow-sm active:opacity-80"
            >
              <Icon name="heart" size={20} color={INK} />
              <View className="absolute -top-1 -right-1 size-[18px] items-center justify-center rounded-full bg-error-500">
                <Text variant="caption-2" emphasized className="text-white">
                  {nav.wishlistCount}
                </Text>
              </View>
            </Button>
          </View>
        </View>

        <Button
          variant="ghost"
          onPress={() => router.push('/search')}
          accessibilityRole="search"
          accessibilityLabel={nav.searchPlaceholder}
          className="my-0 mt-4 h-[44px] flex-row items-center gap-2.5 rounded-lg border border-neutral-200 bg-neutral-100 py-1.5 pr-2 pl-4 active:opacity-80"
        >
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
        </Button>
      </View>

      <LocaleModal ref={locale.ref} />
      <SupportModal ref={support.ref} />
      <WishlistModal ref={wishlist.ref} />
    </Animated.View>
  );
}

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
        className="absolute inset-0 overflow-hidden rounded-b-3xl"
      >
        <BlurView
          tint="dark"
          intensity={40}
          blurTarget={blurTarget}
          blurMethod="dimezisBlurViewSdk31Plus"
          style={{ flex: 1 }}
        />
        <View
          className="absolute inset-0"
          style={{ backgroundColor: 'rgba(2,6,23,0.6)' }}
        />
      </Animated.View>
    </>
  );
}
