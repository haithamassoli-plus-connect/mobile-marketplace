import type { SellerProfile } from '../data';
import type { IconName } from '@/features/home/components/icon';
import { useState } from 'react';

import { Image, Modal, Pressable, ScrollView, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { SellerSheet } from './seller-sheet';

const INK_800 = '#252b37'; // neutral-800
const SELLER_SNAP = [370]; // ponytail: fixed sheet height — content is compact and static.

// Main product image + floating pills + page dots + thumbnail strip. The active
// index is owned here and shared between the dots and the thumbnails — tapping a
// thumbnail swaps the main image. No swipe pager (spec drives it from thumbnails).
export function Gallery({ images, seller }: { images: string[]; seller: SellerProfile }) {
  const [active, setActive] = useState(0);
  const [wished, setWished] = useState(false);
  const sellerModal = useModal();
  return (
    <View>
      <View className="relative h-[400px] bg-neutral-100">
        <Image source={images[active]} contentFit="contain" className="size-full" transition={150} />
        {/* ponytail: opens the seller sheet. */}
        <Pressable
          onPress={() => sellerModal.present()}
          className="absolute top-3 left-3 flex-row items-center gap-2 rounded-full bg-white py-1 pr-2.5 pl-1.5 shadow-sm"
        >
          <Image source={seller.avatar} contentFit="cover" className="size-6 rounded-full" />
          <Text variant="footnote" emphasized className="text-neutral-900">{seller.name}</Text>
          <Icon name="badge-check" size={14} color="#2e90fa" />
          <Icon name="chevron-right" size={14} color="#717680" />
        </Pressable>
        {/* ponytail: local wishlist toggle — no store yet. */}
        <Pressable
          onPress={() => setWished(v => !v)}
          accessibilityRole="button"
          accessibilityLabel={wished ? 'Remove from wishlist' : 'Add to wishlist'}
          className="absolute top-3 right-3 size-9 items-center justify-center rounded-full bg-white shadow-sm"
        >
          <Icon name="heart" size={20} color={wished ? '#dbb42c' : '#181d27'} />
        </Pressable>
        <GalleryPill icon="rotate-3d" label="360 View" className="left-3" />
        <GalleryPill icon="maximize" label="Zoom" className="right-3" />
        <View className="absolute inset-x-0 bottom-3 flex-row items-center justify-center gap-1.5">
          {images.map((_, i) => (
            <View
              // eslint-disable-next-line react/no-array-index-key -- static positional gallery; the key is the active index
              key={i}
              className={
                i === active
                  ? 'h-1.5 w-4 rounded-full bg-gold-500'
                  : 'size-1.5 rounded-full bg-neutral-300'
              }
            />
          ))}
        </View>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
        className="pt-3 pb-1"
      >
        {images.map((src, i) => (
          <Pressable
            // eslint-disable-next-line react/no-array-index-key -- static positional gallery; the key is the active index
            key={i}
            onPress={() => setActive(i)}
            className={`h-16 w-14 overflow-hidden rounded-[10px] bg-neutral-100 ${
              i === active ? 'border-2 border-gold-500' : 'border border-neutral-200'
            }`}
          >
            <Image source={src} contentFit="cover" className="size-full" />
          </Pressable>
        ))}
      </ScrollView>

      <Modal ref={sellerModal.ref} snapPoints={SELLER_SNAP}>
        <SellerSheet seller={seller} />
      </Modal>
    </View>
  );
}

// ponytail: decorative — 360 View / Zoom have no handler yet.
function GalleryPill({ icon, label, className }: { icon: IconName; label: string; className: string }) {
  return (
    <Pressable
      className={`absolute bottom-3 flex-row items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2.5 shadow-sm ${className}`}
    >
      <Icon name={icon} size={14} color={INK_800} />
      <Text variant="footnote" emphasized className="text-neutral-800">{label}</Text>
    </Pressable>
  );
}
