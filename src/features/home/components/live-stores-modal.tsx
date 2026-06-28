import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Seller } from '@/features/home/data';
import {
  BottomSheetScrollView,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Text, useModal, View } from '@/components/ui';
import { renderBackdrop } from '@/components/ui/modal';
import { sellers } from '@/features/home/data';
import { Icon } from './icon';

// Other-live-stores sheet (Figma 172:4036). Reuses the verified-sellers data —
// first product image is the stream thumbnail, review count stands in for viewers.
const INK = '#0a0909'; // secondary-950 — dark text on the gold button

export function LiveStoresModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  return (
    <Sheet
      ref={modal.ref}
      snapPoints={['80%']}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      {/* Header */}
      <View className="gap-0.5 px-5 pb-3.5">
        <Text variant="headline" emphasized className="text-neutral-900">Live right now</Text>
        <Text variant="footnote" className="text-neutral-500">
          {sellers.length}
          {' '}
          other sellers streaming live
        </Text>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        className="px-5"
      >
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {sellers.map(s => (
            <Card key={s.id} seller={s} />
          ))}
        </View>
      </BottomSheetScrollView>
    </Sheet>
  );
}

function Card({ seller }: { seller: Seller }) {
  return (
    <View className="w-[48.5%] overflow-hidden rounded-2xl border border-neutral-200 bg-white">
      <View className="h-[170px] bg-neutral-100">
        <Image source={seller.products[0]} contentFit="cover" className="absolute inset-0 size-full" />
        <View className="absolute inset-x-0 bottom-0 h-[70px] bg-black/30" />
        <View className="absolute top-2 left-2 flex-row items-center gap-1 rounded-full bg-error-500 py-[3px] pr-2 pl-1.5">
          <View className="size-[5px] rounded-full bg-white" />
          <Text variant="caption-2" emphasized className="text-white">LIVE</Text>
        </View>
        <View className="absolute bottom-2 left-2 flex-row items-center gap-1 rounded-full bg-black/45 py-[3px] pr-2 pl-[7px]">
          <Icon name="eye" size={13} color="#ffffff" />
          <Text variant="caption-2" emphasized className="text-white">{seller.reviews}</Text>
        </View>
      </View>

      <View className="gap-0.5 px-3 pt-2.5 pb-3">
        <Text variant="subheadline" emphasized className="text-neutral-900" numberOfLines={1}>
          {seller.name}
        </Text>
        <Text variant="caption-1" className="text-neutral-500" numberOfLines={1}>
          {seller.category}
        </Text>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`watch ${seller.name} live`}
          className="mt-2 h-9 flex-row items-center justify-center gap-1.5 rounded-xl bg-primary-500 active:opacity-90"
        >
          <Icon name="play" size={14} color={INK} />
          <Text variant="caption-1" emphasized className="text-secondary-950">Watch</Text>
        </Pressable>
      </View>
    </View>
  );
}

function Handle() {
  return (
    <View className="items-center pt-2.5 pb-3">
      <View className="h-[5px] w-10 rounded-full bg-neutral-300" />
    </View>
  );
}
