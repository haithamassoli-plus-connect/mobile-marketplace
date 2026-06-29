import type { IconName } from '@/features/home/components/icon';
import { useState } from 'react';

import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const INK_800 = '#252b37'; // neutral-800

// Main product image + floating pills + page dots + thumbnail strip. The active
// index is owned here and shared between the dots and the thumbnails — tapping a
// thumbnail swaps the main image. No swipe pager (spec drives it from thumbnails).
export function Gallery({ images }: { images: string[] }) {
  const [active, setActive] = useState(0);
  return (
    <View>
      <View className="relative h-[400px] bg-neutral-100">
        <Image source={images[active]} contentFit="contain" className="size-full" transition={150} />
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
