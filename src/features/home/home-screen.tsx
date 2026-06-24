import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import Animated, {
  runOnJS,
  useAnimatedRef,
  useAnimatedScrollHandler,
  useSharedValue,
} from 'react-native-reanimated';

import { View } from '@/components/ui';

import { BottomNav } from './components/bottom-nav';
import { DiscoverSection } from './components/discover-section';
import { FeaturedRail } from './components/featured-rail';
import { LiveVideo } from './components/live-video';
import { Navbar } from './components/navbar';
import { ProductRail } from './components/primitives';
import { PromoBanner } from './components/promo-banner';
import { SellerCta } from './components/seller-cta';
import { StoriesRow } from './components/stories-row';
import { TrendingGrid } from './components/trending-grid';
import { TrustedBrands } from './components/trusted-brands';
import { VerifiedSellers } from './components/verified-sellers';
import { bestSellers, topRated } from './data';

// Scroll thresholds that drive the bottom-nav state (all in px).
const SHRINK_AT = 60; // don't shrink while still near the top
const FAR_AT = 320; // reveal the scroll-to-top handle after ~a screenful
const DIR_HYST = 4; // ignore sub-pixel jitter when reading scroll direction

// ponytail: one ScrollView over ~12 fixed sections (not FlashList) — the list is
// static and heterogeneous, so virtualization buys nothing. Switch to FlashList
// if sections become data-driven and long.
export function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  // Scroll tracking lives on the UI thread (worklet); only the two booleans below
  // cross to JS, and only when they actually flip — so no per-frame re-renders.
  const lastY = useSharedValue(0);
  const miniSV = useSharedValue(false);
  const farSV = useSharedValue(false);
  const [mini, setMini] = useState(false);
  const [far, setFar] = useState(false);

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      const dy = y - lastY.value;

      const nextFar = y > FAR_AT;
      if (nextFar !== farSV.value) {
        farSV.value = nextFar;
        runOnJS(setFar)(nextFar);
      }

      let nextMini = miniSV.value;
      if (y < SHRINK_AT)
        nextMini = false; // expanded near the top
      else if (dy > DIR_HYST)
        nextMini = true; // scrolling down → shrink
      else if (dy < -DIR_HYST)
        nextMini = false; // scrolling up → expand
      if (nextMini !== miniSV.value) {
        miniSV.value = nextMini;
        runOnJS(setMini)(nextMini);
      }

      lastY.value = y;
    },
  });

  const scrollToTop = () =>
    scrollRef.current?.scrollTo({ y: 0, animated: true });

  return (
    <View className="bg-ink-900 flex-1">
      <StatusBar style="light" />
      <Animated.ScrollView
        ref={scrollRef}
        onScroll={onScroll}
        scrollEventThrottle={16}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 120 }}
      >
        <Navbar />
        <View className="bg-neutral-50 pb-4">
          <StoriesRow />
          <FeaturedRail />
          <TrendingGrid />
          <LiveVideo />
          <PromoBanner />
          <ProductRail
            title="Best Seller"
            subtitle="Shop our best-selling products — trusted, loved, and chosen by shoppers like you."
            icon="flame"
            products={bestSellers}
          />
          <ProductRail
            title="Top Rated"
            subtitle="Customer favorites with the highest ratings and trusted reviews."
            icon="award"
            products={topRated}
          />
          <DiscoverSection />
          <TrustedBrands />
          <VerifiedSellers />
          <SellerCta />
        </View>
      </Animated.ScrollView>
      <BottomNav
        mini={mini}
        showScrollTop={far}
        onScrollToTop={scrollToTop}
      />
    </View>
  );
}
