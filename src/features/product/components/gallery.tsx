import type { View as RNView } from 'react-native';
import type { SellerProfile } from '../data';
import type { IconName } from '@/features/home/components/icon';
import { memo, useState } from 'react';

import { Image, ImageViewer, Modal, Pressable, ScrollView, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { SellerSheet } from './seller-sheet';

const INK_800 = '#252b37'; // neutral-800
const SELLER_SNAP = [370]; // ponytail: fixed sheet height — content is compact and static.

// Main product image + floating pills + page dots + thumbnail strip. The active
// index is owned here and shared between the dots and the thumbnails — tapping a
// thumbnail swaps the main image. No swipe pager (spec drives it from thumbnails).
function GalleryImpl({
  images,
  seller,
  mainImageRef,
  onActiveChange,
}: {
  images: string[];
  seller: SellerProfile;
  mainImageRef?: React.Ref<RNView>;
  onActiveChange?: (src: string) => void;
}) {
  const [active, setActive] = useState(0);
  const [viewerOpen, setViewerOpen] = useState(false);
  const sellerModal = useModal();
  return (
    <View>
      <View ref={mainImageRef} className="relative h-[400px] bg-neutral-100">
        <Pressable
          onPress={() => setViewerOpen(true)}
          accessibilityRole="imagebutton"
          accessibilityLabel="View image fullscreen"
          className="size-full"
        >
          <Image source={images[active]} contentFit="contain" className="size-full" transition={150} />
        </Pressable>
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
        <GalleryPill icon="rotate-3d" label="360 View" className="left-3" />
        <GalleryPill icon="maximize" label="Zoom" className="right-3" onPress={() => setViewerOpen(true)} />
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
            onPress={() => {
              setActive(i);
              onActiveChange?.(images[i]);
            }}
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

      <ImageViewer
        visible={viewerOpen}
        images={images}
        initialIndex={active}
        onClose={() => setViewerOpen(false)}
        onIndexChange={setActive}
      />
    </View>
  );
}

export const Gallery = memo(GalleryImpl);

// ponytail: decorative — '360 View' has no handler; only 'Zoom' gets an onPress.
function GalleryPill({ icon, label, className, onPress }: { icon: IconName; label: string; className: string; onPress?: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      className={`absolute bottom-3 flex-row items-center gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2.5 shadow-sm ${className}`}
    >
      <Icon name={icon} size={14} color={INK_800} />
      <Text variant="footnote" emphasized className="text-neutral-800">{label}</Text>
    </Pressable>
  );
}
