import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { WishlistItem } from '@/features/home/data';
import {
  BottomSheetView,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Text, useModal, View } from '@/components/ui';
import { renderBackdrop } from '@/components/ui/modal';
import { wishlist } from '@/features/home/data';
import { Icon } from './icon';

// Wishlist sheet (Figma 457:1516). Same shell as SupportModal — shared backdrop,
// content-sized, drag handle + close. Hearts remove locally so the count and
// "Add all" total stay in sync.
// ponytail: local state only — swap for a wishlist store/mutation when one exists.
const HEART = '#ef4444'; // error-500 — saved heart
const MUTED = '#717680'; // neutral-500
const INK = '#181d27'; // neutral-900
const SUCCESS = '#027a48'; // success-700

export function WishlistModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  const [items, setItems] = React.useState<WishlistItem[]>(wishlist);
  const total = items.reduce((sum, i) => sum + i.price, 0);
  const remove = (id: string) =>
    setItems(prev => prev.filter(i => i.id !== id));

  return (
    <Sheet
      ref={modal.ref}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
    >
      <BottomSheetView
        style={{ paddingBottom: insets.bottom + 20 }}
        className="gap-4 px-5 pt-1.5"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <View className="flex-row items-center gap-3">
            <View
              className="size-[34px] items-center justify-center rounded-full bg-white"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 6,
                shadowOffset: { width: 0, height: 4 },
                elevation: 2,
              }}
            >
              <Icon name="heart" size={20} color={HEART} />
            </View>
            <View>
              <Text variant="title-3" emphasized className="text-neutral-900">
                Wishlist
              </Text>
              <Text variant="footnote" className="text-neutral-500">
                {items.length}
                {' '}
                {items.length === 1 ? 'item' : 'items'}
                {' '}
                saved
              </Text>
            </View>
          </View>
          <Pressable
            onPress={modal.dismiss}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="close wishlist"
            className="size-8 items-center justify-center rounded-2xl bg-neutral-100"
          >
            <Icon name="x" size={16} color={MUTED} />
          </Pressable>
        </View>

        {/* Items */}
        {items.length === 0
          ? (
              <View className="items-center gap-2 py-10">
                <Icon name="heart" size={32} color="#d5d7da" />
                <Text variant="footnote" className="text-neutral-500">
                  Your wishlist is empty
                </Text>
              </View>
            )
          : (
              <View className="gap-5">
                {items.map(item => (
                  <Row key={item.id} item={item} onRemove={() => remove(item.id)} />
                ))}
              </View>
            )}

        {/* Footer */}
        {items.length > 0 && (
          <View className="gap-3 pt-1">
            <View className="h-px w-full bg-neutral-200" />
            <Text
              variant="caption-2"
              className="text-center text-neutral-500"
            >
              Saved items aren’t reserved — add to cart to lock today’s price.
            </Text>
            <Pressable
              accessibilityRole="button"
              accessibilityLabel={`add all to cart, ${total} dollars`}
              className="h-12 flex-row items-center justify-center gap-2 rounded-xl bg-primary-500 active:opacity-90"
            >
              <Icon name="shopping-cart" size={18} color="#0a0909" />
              <Text variant="subheadline" emphasized className="text-secondary-950">
                Add all to cart · $
                {total}
              </Text>
            </Pressable>
          </View>
        )}
      </BottomSheetView>
    </Sheet>
  );
}

function Handle() {
  return (
    <View className="items-center pt-2.5 pb-1">
      <View className="h-[5px] w-10 rounded-full bg-neutral-300" />
    </View>
  );
}

function Row({ item, onRemove }: { item: WishlistItem; onRemove: () => void }) {
  return (
    <View className="flex-row gap-3">
      <Image
        source={item.image}
        contentFit="cover"
        className="size-[92px] rounded-xl bg-neutral-100"
      />

      <View className="flex-1 gap-1">
        <View className="flex-row items-start justify-between">
          <Text
            variant="callout"
            emphasized
            className="flex-1 text-neutral-900"
          >
            {item.title}
          </Text>
          <Pressable
            onPress={onRemove}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel={`remove ${item.title} from wishlist`}
          >
            <Icon name="heart" size={20} color={HEART} />
          </Pressable>
        </View>

        <Text variant="caption-1" className="text-neutral-500">
          {item.category}
        </Text>

        {/* Price row */}
        <View className="flex-row items-center gap-[7px]">
          <Text variant="callout" emphasized className="text-primary-500">
            $
            {item.price}
          </Text>
          {!!item.oldPrice && (
            <Text variant="caption-1" className="text-neutral-400 line-through">
              $
              {item.oldPrice}
            </Text>
          )}
          {item.priceDropped && (
            <View className="flex-row items-center gap-[3px] rounded-full bg-success-50 py-[3px] pr-2 pl-1.5">
              <Icon name="trending-down" size={12} color={SUCCESS} />
              <Text variant="caption-2" emphasized className="text-success-700">
                Price dropped
              </Text>
            </View>
          )}
          {item.stockBadge && (
            <View
              className={`rounded-full px-2 py-[3px] ${
                item.stockBadge.tone === 'error' ? 'bg-error-50' : 'bg-success-50'
              }`}
            >
              <Text
                variant="caption-2"
                emphasized
                className={
                  item.stockBadge.tone === 'error'
                    ? 'text-error-700'
                    : 'text-success-700'
                }
              >
                {item.stockBadge.label}
              </Text>
            </View>
          )}
        </View>

        {/* Cart row */}
        <View className="mt-0.5 flex-row items-center gap-2.5">
          <Pressable
            accessibilityRole="button"
            accessibilityLabel={`add ${item.title} to cart`}
            className="flex-row items-center gap-2 rounded-[10px] border border-neutral-300 bg-white px-[18px] py-[11px] active:opacity-80"
          >
            <Icon name="shopping-cart" size={17} color={INK} />
            <Text variant="subheadline" emphasized className="text-neutral-900">
              Add to cart
            </Text>
          </Pressable>
          {!!item.meta && (
            <Text
              variant="caption-2"
              emphasized
              className={
                item.metaTone === 'success'
                  ? 'text-success-700'
                  : 'text-neutral-500'
              }
            >
              {item.meta}
            </Text>
          )}
        </View>
      </View>
    </View>
  );
}
