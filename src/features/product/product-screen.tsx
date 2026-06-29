import type { View as RNView } from 'react-native';
import type { IconName } from '@/features/home/components/icon';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useCallback, useEffect, useRef, useState } from 'react';
import Animated, { useAnimatedStyle, useSharedValue, withSequence, withTiming } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Coupon } from './components/coupon';
import { FlyToCart } from './components/fly-to-cart';
import { Gallery } from './components/gallery';
import { ProductTabs } from './components/product-tabs';
import { PurchaseBar } from './components/purchase-bar';
import { PurchasePanel } from './components/purchase-panel';
import { Related } from './components/related';
import { Reviews } from './components/reviews';
import { accordions, coupons, product, ratingHistogram, relatedProducts, reviews, sellerProfile } from './data';

const INK_900 = '#181d27'; // neutral-900
const NEUTRAL_700 = '#414651';
const START_CART_COUNT = 3;

type Rect = { x: number; y: number; width: number; height: number };
type FlyState = { source: string; start: Rect; end: { x: number; y: number } };

// PDP route screen. Sticky AppBar + sticky PurchaseBar live outside the ScrollView
// (siblings in a flex column), so the bars never overlap the content.
// ponytail: `id` keys the route but data is a single static product for now; it is
// surfaced as a testID until a React Query lookup is wired.
export function ProductScreen({ id }: { id: string }) {
  const insets = useSafeAreaInsets();
  const [cartCount, setCartCount] = useState(START_CART_COUNT);
  const [flyState, setFlyState] = useState<FlyState | null>(null);
  const [bumpKey, setBumpKey] = useState(0);
  const activeImageRef = useRef(product.gallery[0]);
  const cartRef = useRef<RNView>(null);
  const galleryRef = useRef<RNView>(null);
  // Derive the button morph from the cart, not a parallel flag.
  const added = cartCount > START_CART_COUNT;

  // The active gallery image is only read when a flight launches, so keep it in a
  // ref — mirroring it as state would re-render the whole screen on every thumbnail tap.
  const onActiveImageChange = useCallback((src: string) => {
    activeImageRef.current = src;
  }, []);

  // Tap logic lives in the event handler (not an effect): measure both rects, then
  // mount the flying copy. Both measureInWindow values map directly onto the
  // absolute inset-0 overlay because the root View fills the window from (0,0).
  const onAddToCart = () => {
    // Block re-entry once added, and while a flight is already in the air —
    // `added` only flips ~600ms later on landing, so guard on flyState too.
    if (added || flyState !== null)
      return;
    // Rest params keep each measureInWindow callback at one parameter (the API
    // hands back x, y, width, height positionally).
    galleryRef.current?.measureInWindow((...g: number[]) =>
      cartRef.current?.measureInWindow((...c: number[]) =>
        setFlyState({
          source: activeImageRef.current,
          start: { x: g[0], y: g[1], width: g[2], height: g[3] },
          end: { x: c[0] + c[2] / 2, y: c[1] + c[3] / 2 },
        }),
      ),
    );
    // ponytail: if the gallery is scrolled off-screen the fly just starts from its
    // measured (possibly negative) y — acceptable.
  };

  const onLand = useCallback(() => {
    setFlyState(null);
    setCartCount(c => c + 1);
    setBumpKey(k => k + 1);
  }, []);

  return (
    <View testID={`pdp-${id}`} className="flex-1 bg-white">
      <StatusBar style="dark" />
      <AppBar insetTop={insets.top} cartCount={cartCount} cartRef={cartRef} bumpKey={bumpKey} />
      <ScrollView
        className="flex-1"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 24 }}
      >
        <Gallery images={product.gallery} seller={sellerProfile} mainImageRef={galleryRef} onActiveChange={onActiveImageChange} />
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
      <PurchaseBar insetBottom={insets.bottom} added={added} onAddToCart={onAddToCart} />
      {flyState && <FlyToCart {...flyState} onLand={onLand} />}
    </View>
  );
}

function AppBar({
  insetTop,
  cartCount,
  cartRef,
  bumpKey,
}: {
  insetTop: number;
  cartCount: number;
  cartRef: React.Ref<RNView>;
  bumpKey: number;
}) {
  const scale = useSharedValue(1);
  useEffect(() => {
    if (bumpKey > 0) {
      scale.set(withSequence(withTiming(1.25, { duration: 120 }), withTiming(1, { duration: 120 })));
    }
  }, [bumpKey, scale]);
  const bumpStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));
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
      <Pressable ref={cartRef} hitSlop={8} className="size-10 items-center justify-center active:opacity-60">
        <Animated.View style={bumpStyle} className="size-full items-center justify-center">
          <Icon name="shopping-cart" size={22} color={INK_900} />
          <View className="absolute top-1.5 right-1.5 size-4 items-center justify-center rounded-full bg-error-500">
            <Text variant="caption-2" emphasized className="text-white">{cartCount}</Text>
          </View>
        </Animated.View>
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
