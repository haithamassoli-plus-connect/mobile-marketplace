import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import { LinearGradient } from 'expo-linear-gradient';
import * as React from 'react';
import { Share, StyleSheet } from 'react-native';

import { BackgroundVideo, Image, Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { live } from '@/features/home/data';
import { LiveProductsModal } from './live-products-modal';
import { LiveStoresModal } from './live-stores-modal';

// ponytail: dummy live-stream comments — the data module has no comments field.
const comments = [
  { id: 'c1', user: 'Sneha', text: 'Love this bag!', starred: true, opacity: 'opacity-60' },
  { id: 'c2', user: 'Ankit', text: 'Is it available in black?', opacity: 'opacity-80' },
  { id: 'c3', user: 'Pooja', text: 'Amazing quality!', starred: true, opacity: 'opacity-90' },
  { id: 'c4', user: 'Kavya', text: 'What is the material?' },
];

export function LiveVideo() {
  const productsRef = React.useRef<BottomSheetModal>(null);
  const storesRef = React.useRef<BottomSheetModal>(null);
  const [muted, setMuted] = React.useState(true);

  const share = () =>
    Share.share({
      message: `${live.host} is live now — ${live.badge} · ${live.count} watching. Come shop the looks!`,
    });

  const actions = [
    { id: 'products', icon: 'shopping-bag' as const, label: 'Products', onPress: () => productsRef.current?.present() },
    { id: 'lives', icon: 'radio' as const, label: 'Lives', onPress: () => storesRef.current?.present() },
    { id: 'share', icon: 'share-2' as const, label: 'Share', onPress: share },
  ];

  return (
    // ponytail: px-4 wrapper keeps the card centered; w-full makes width explicit so
    // the aspect ratio drives only height. rounded-3xl == Figma radius/24.
    <View className="mt-8 px-4">
      <View className="relative aspect-361/722 w-full overflow-hidden rounded-3xl">
        {/* Live stream — dummy video over the poster (poster shows while it buffers) */}
        <Image
          source={live.image}
          contentFit="cover"
          className="absolute inset-0 size-full"
        />
        <BackgroundVideo source={live.video} muted={muted} />
        {/* Legibility gradients — Figma 166:4193 (top scrim, black 0.5→0) +
            166:4194 (bottom scrim, 0→black 0.82). Default direction is top→bottom. */}
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0.5)', 'rgba(0,0,0,0)'] as const}
          style={styles.topScrim}
        />
        <LinearGradient
          pointerEvents="none"
          colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.82)'] as const}
          style={styles.bottomScrim}
        />

        {/* Top-left: LIVE badge + host */}
        <View className="absolute top-4 left-4 gap-2">
          <View className="flex-row items-center gap-1.5 self-start rounded-lg bg-error-500 py-[5px] pr-2.5 pl-2">
            <View className="size-[7px] rounded-full bg-white" />
            <Text variant="caption-2" emphasized className="text-white">
              {`${live.badge} · ${live.count}`}
            </Text>
          </View>
          <View className="flex-row items-center gap-2 self-start rounded-xl bg-black/40 p-1">
            <Image
              source={live.products[0].image}
              contentFit="cover"
              className="size-7 rounded-full"
            />
            <Text variant="footnote" emphasized className="pr-1 text-white">{live.host}</Text>
          </View>
        </View>

        {/* Top-right: mute toggle */}
        <Pressable
          onPress={() => setMuted((m) => !m)}
          accessibilityRole="button"
          accessibilityLabel={muted ? 'Unmute video' : 'Mute video'}
          className="absolute top-[18px] right-4 size-9 items-center justify-center rounded-full bg-black/50"
        >
          <Icon name={muted ? 'volume-x' : 'volume-2'} size={18} color="#ffffff" />
        </Pressable>

        {/* Right action sidebar */}
        <View className="absolute right-4 bottom-[86px] items-center gap-[18px]">
          {actions.map(a => (
            <Pressable key={a.id} onPress={a.onPress} className="items-center gap-1.5">
              <View className="size-12 items-center justify-center rounded-full bg-black/50">
                <Icon name={a.icon} size={22} color="#ffffff" />
              </View>
              <Text variant="caption-2" emphasized className="text-white/95">{a.label}</Text>
            </Pressable>
          ))}
        </View>

        {/* Live comments */}
        <View className="absolute bottom-[78px] left-4 gap-1.5">
          {comments.map(c => (
            <View
              key={c.id}
              className={`flex-row items-center gap-1.5 self-start rounded-2xl bg-black/35 py-1.5 pr-3 pl-2.5 ${c.opacity ?? ''}`}
            >
              <Text variant="caption-1" emphasized className="text-gold-500">{c.user}</Text>
              {c.starred ? <Icon name="star" size={11} color="#dbb42c" /> : null}
              <Text variant="footnote" className="text-white/95">{c.text}</Text>
            </View>
          ))}
        </View>

        {/* Comment input */}
        <View className="absolute inset-x-4 bottom-4 flex-row items-center gap-2.5">
          <View className="flex-1 rounded-full border border-white/25 bg-white/15 px-4 py-3">
            <Text variant="footnote" className="text-white/80">Say something…</Text>
          </View>
          <Pressable className="size-[46px] items-center justify-center rounded-full bg-gold-500">
            <Icon name="send" size={20} color="#0a0d12" />
          </Pressable>
        </View>
      </View>

      <LiveProductsModal ref={productsRef} />
      <LiveStoresModal ref={storesRef} />
    </View>
  );
}

const styles = StyleSheet.create({
  topScrim: { position: 'absolute', top: 0, right: 0, left: 0, height: 170 },
  bottomScrim: { position: 'absolute', right: 0, bottom: 0, left: 0, height: 330 },
});
