import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { Product } from '@/features/home/data';
import {
  BottomSheetScrollView,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Text, useModal, View } from '@/components/ui';
import { renderBackdrop } from '@/components/ui/modal';
import { live } from '@/features/home/data';
import { Icon } from './icon';

// Featured-products sheet for the live stream (Figma 170:4036).
// Same shell as WishlistModal — shared backdrop + drag handle. Cards are static.
const INK = '#181d27'; // neutral-900

export function LiveProductsModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  return (
    <Sheet
      ref={modal.ref}
      snapPoints={['75%']}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      {/* Header */}
      <View className="flex-row items-center gap-2 px-5 pb-3.5">
        <View className="flex-row items-center gap-1 rounded-full bg-error-500 py-[3px] pr-2 pl-[7px]">
          <View className="size-1.5 rounded-full bg-white" />
          <Text variant="caption-2" emphasized className="text-white">{live.badge}</Text>
        </View>
        <Text variant="headline" emphasized className="text-neutral-900">Featured Products</Text>
      </View>

      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 24 }}
        className="px-5"
      >
        <View className="flex-row flex-wrap justify-between gap-y-3">
          {live.products.map(p => (
            <Card key={p.id} product={p} />
          ))}
        </View>
      </BottomSheetScrollView>
    </Sheet>
  );
}

function Card({ product }: { product: Product }) {
  return (
    <View
      className="w-[48.5%] gap-2.5 rounded-2xl border border-neutral-200 bg-white px-2 pt-2 pb-3"
      style={{
        shadowColor: '#000',
        shadowOpacity: 0.08,
        shadowRadius: 18,
        shadowOffset: { width: 0, height: 6 },
        elevation: 2,
      }}
    >
      <View className="h-[149px] rounded-xl bg-neutral-100">
        <Image source={product.image} contentFit="cover" className="absolute inset-0 size-full rounded-xl" />
        {!!product.badge && (
          <View className="absolute top-2 left-2 rounded-full bg-secondary-950 px-2 py-[3px]">
            <Text variant="caption-2" emphasized className="text-white">{product.badge}</Text>
          </View>
        )}
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`save ${product.title}`}
          hitSlop={6}
          className="absolute top-2 right-2 size-[34px] items-center justify-center rounded-full bg-white"
          style={{
            shadowColor: '#000',
            shadowOpacity: 0.1,
            shadowRadius: 6,
            shadowOffset: { width: 0, height: 4 },
            elevation: 2,
          }}
        >
          <Icon name="heart" size={18} color={INK} />
        </Pressable>
      </View>

      <View className="gap-1">
        <Text variant="subheadline" emphasized className="text-neutral-900" numberOfLines={1}>
          {product.title}
        </Text>
        <View className="flex-row items-baseline gap-1.5">
          <Text variant="headline" emphasized className="text-primary-500">{`$ ${product.price}`}</Text>
          {!!product.oldPrice && (
            <Text variant="caption-1" className="text-neutral-500 line-through">{`$ ${product.oldPrice}`}</Text>
          )}
        </View>
      </View>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel={`add ${product.title} to cart`}
        className="h-[42px] items-center justify-center rounded-xl bg-primary-500 active:opacity-90"
      >
        <Text variant="footnote" emphasized className="text-secondary-950">Add to cart</Text>
      </Pressable>
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
