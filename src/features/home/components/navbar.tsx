import { useSafeAreaInsets } from 'react-native-safe-area-context';
import Svg, { Path } from 'react-native-svg';

import { Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { nav } from '@/features/home/data';

export function Navbar() {
  const insets = useSafeAreaInsets();

  return (
    <View className="bg-ink-900 px-4 pb-5" style={{ paddingTop: insets.top }}>
      {/* Row 1: logo + actions */}
      <View className="flex-row items-center justify-between">
        {/* Logo */}
        <View className="flex-row items-center gap-2">
          <Icon name="shopping-cart" size={26} color="#DBB42C" />
          <Text className="text-[22px] leading-[24px] font-bold text-white">
            {nav.brand}
          </Text>
        </View>

        {/* Right actions */}
        <View className="flex-row items-center gap-2">
          {/* Locale switcher */}
          <View className="flex-row items-center gap-1 rounded-full bg-white px-3 py-1.5">
            <Icon name="globe" size={14} color="#252b37" />
            <Text className="text-[13px] font-semibold text-ink-800">
              {nav.locale}
            </Text>
          </View>

          {/* LIVE button */}
          <View className="flex-row items-center gap-1 rounded-2xl bg-ink-800 px-3 py-1.5">
            <Icon name="radio" size={14} color="#ef4444" />
            <Text className="text-[12px] font-bold text-white">LIVE</Text>
          </View>

          {/* Wishlist */}
          <View className="size-9 items-center justify-center rounded-full bg-white">
            <Icon name="heart" size={20} color="#181d27" />
            <View className="absolute -top-1 -right-1 size-[18px] items-center justify-center rounded-full bg-gold-500">
              <Text className="text-[10px] font-semibold text-white">
                {nav.wishlistCount}
              </Text>
            </View>
          </View>
        </View>
      </View>

      {/* Row 2: search bar */}
      <View className="mt-4 h-[44px] flex-row items-center gap-2 rounded-full bg-white/10 px-4">
        <Icon name="search" size={18} color="#d5d7da" />
        <Text
          numberOfLines={1}
          className="flex-1 text-[13px] text-neutral-400"
        >
          {nav.searchPlaceholder}
        </Text>
        <View className="flex-row items-center gap-3">
          <Icon name="mic" size={20} color="#d5d7da" />
          <Icon name="camera" size={20} color="#d5d7da" />
        </View>
      </View>

      {/* Tagline + wavy gold underline */}
      <View className="mt-4 items-center">
        <Text className="text-[15px] font-medium text-white">
          {nav.tagline}
        </Text>
        <Svg width={180} height={10} viewBox="0 0 180 10" className="mt-1">
          <Path
            d="M2 6 C 30 0, 60 0, 90 5 S 150 10, 178 4"
            stroke="#DBB42C"
            strokeWidth={3}
            strokeLinecap="round"
            fill="none"
          />
        </Svg>
      </View>
    </View>
  );
}
