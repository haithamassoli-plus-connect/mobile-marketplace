import type { View as RNView } from 'react-native';
import type { SellerProfile } from '../data';
import type { IconName } from '@/features/home/components/icon';
import { memo, useState } from 'react';

import { Button, Image, ImageViewer, Modal, ScrollView, Text, useModal, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { SellerSheet } from './seller-sheet';

const INK_800 = '#252b37';
const SELLER_SNAP = [370];

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
        <Button
          variant="ghost"
          onPress={() => setViewerOpen(true)}
          accessibilityRole="imagebutton"
          accessibilityLabel="View image fullscreen"
          className="my-0 size-full rounded-none px-0"
        >
          <Image source={images[active]} contentFit="contain" className="size-full" transition={150} />
        </Button>
        <Button
          variant="ghost"
          onPress={() => sellerModal.present()}
          className="absolute top-3 left-3 my-0 h-auto flex-row items-center justify-start gap-2 rounded-full bg-white py-1 pr-2.5 pl-1.5 shadow-sm"
        >
          <Image source={seller.avatar} contentFit="cover" className="size-6 rounded-full" />
          <Text variant="footnote" emphasized className="text-neutral-900">{seller.name}</Text>
          <Icon name="badge-check" size={14} color="#2e90fa" />
          <Icon name="chevron-right" size={14} color="#717680" />
        </Button>
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
          <Button
            variant="ghost"
            // eslint-disable-next-line react/no-array-index-key -- static positional gallery; the key is the active index
            key={i}
            onPress={() => {
              setActive(i);
              onActiveChange?.(images[i]);
            }}
            className={`my-0 h-16 w-14 overflow-hidden rounded-[10px] bg-neutral-100 px-0 ${
              i === active ? 'border-2 border-gold-500' : 'border border-neutral-200'
            }`}
          >
            <Image source={src} contentFit="cover" className="size-full" />
          </Button>
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

function GalleryPill({ icon, label, className, onPress }: { icon: IconName; label: string; className: string; onPress?: () => void }) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      className={`absolute bottom-3 my-0 h-auto flex-row items-center justify-start gap-1.5 rounded-full bg-white py-1.5 pr-3 pl-2.5 shadow-sm ${className}`}
    >
      <Icon name={icon} size={14} color={INK_800} />
      <Text variant="footnote" emphasized className="text-neutral-800">{label}</Text>
    </Button>
  );
}
