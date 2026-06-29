import type { IconName } from '@/features/home/components/icon';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Coupon } from './components/coupon';
import { Gallery } from './components/gallery';
import { ProductTabs } from './components/product-tabs';
import { PurchaseBar } from './components/purchase-bar';
import { PurchasePanel } from './components/purchase-panel';
import { Related } from './components/related';
import { Reviews } from './components/reviews';
import { accordions, coupons, product, ratingHistogram, relatedProducts, reviews } from './data';

const INK_900 = '#181d27'; // neutral-900
const NEUTRAL_700 = '#414651';
const CART_COUNT = 3;

// PDP route screen. Sticky AppBar + sticky PurchaseBar live outside the ScrollView
// (siblings in a flex column), so the bars never overlap the content.
// ponytail: `id` keys the route but data is a single static product for now; it is
// surfaced as a testID until a React Query lookup is wired.
export function ProductScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  return (
    <View testID={`pdp-${id}`} className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppBar insetTop={insets.top} cartCount={CART_COUNT} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Gallery images={product.gallery} seller={product.seller} sellerAvatar={product.sellerAvatar} />
        <View className="h-px bg-neutral-200" />
        <PurchasePanel product={product} />
        <Coupon coupons={coupons} />
        <Reviews
          summary={{ rating: product.rating, reviewCount: product.reviewCount, bars: ratingHistogram }}
          reviews={reviews}
        />
        <ServicesStrip />
        <ProductTabs tabs={accordions} />
        <Related items={relatedProducts} />
      </ScrollView>
      <PurchaseBar insetBottom={insets.bottom} />
    </View>
  );
}

function AppBar({ insetTop, cartCount }: { insetTop: number; cartCount: number }) {
  return (
    <View className="flex-row items-center bg-white p-2" style={{ paddingTop: insetTop + 8 }}>
      <Pressable
        onPress={() => router.back()}
        hitSlop={8}
        accessibilityRole="button"
        accessibilityLabel="Go back"
        className="size-10 items-center justify-center active:opacity-60"
      >
        <Icon name="arrow-left" size={24} color={INK_900} />
      </Pressable>
      <View className="flex-1" />
      {/* ponytail: decorative — share/cart have no handlers yet. */}
      <Pressable hitSlop={8} className="size-10 items-center justify-center active:opacity-60">
        <Icon name="share" size={22} color={INK_900} />
      </Pressable>
      <Pressable hitSlop={8} className="size-10 items-center justify-center active:opacity-60">
        <Icon name="shopping-cart" size={22} color={INK_900} />
        <View className="absolute top-1.5 right-1.5 size-4 items-center justify-center rounded-full bg-error-500">
          <Text variant="caption-2" emphasized className="text-white">{cartCount}</Text>
        </View>
      </Pressable>
    </View>
  );
}

function ServicesStrip() {
  return (
    <View className="flex-row justify-between bg-neutral-50 px-[18px] py-[14px]">
      <ServiceItem icon="truck" label="Free Shipping" />
      <ServiceItem icon="headset" label="24/7 Support" />
      <ServiceItem icon="shield-check" label="Secure Pay" />
    </View>
  );
}

function ServiceItem({ icon, label }: { icon: IconName; label: string }) {
  return (
    <View className="flex-row items-center gap-1.5">
      <Icon name={icon} size={18} color={NEUTRAL_700} />
      <Text variant="footnote" className="font-medium text-neutral-700">{label}</Text>
    </View>
  );
}

export default ProductScreen;
