import type { View as RNView } from 'react-native';
import { BlurTargetView } from 'expo-blur';
import { StatusBar } from 'expo-status-bar';
import { useEffect, useRef, useState } from 'react';
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
import { HomeScreenSkeleton } from './components/home-skeleton';
import { LiveVideo } from './components/live-video';
import { Navbar } from './components/navbar';
import { ProductRail } from './components/primitives';
import { PromoBanner } from './components/promo-banner';
import { SellerCta } from './components/seller-cta';
import { StoriesRow } from './components/stories-row';
import { Tagline } from './components/tagline';
import { TrendingGrid } from './components/trending-grid';
import { TrustedBrands } from './components/trusted-brands';
import { VerifiedSellers } from './components/verified-sellers';
import { bestSellers, topRated } from './data';

const SHRINK_AT = 60;
const FAR_AT = 320;
const DIR_HYST = 4;

const NAV_ESTIMATE = 220;

function useFakeLoading(ms = 2000) {
  const [loading, setLoading] = useState(true);
  useEffect(() => {
    const t = setTimeout(setLoading, ms, false);
    return () => clearTimeout(t);
  }, [ms]);
  return loading;
}

export function HomeScreen() {
  const scrollRef = useAnimatedRef<Animated.ScrollView>();
  const lastY = useSharedValue(0);
  const miniSV = useSharedValue(false);
  const farSV = useSharedValue(false);
  const atTopSV = useSharedValue(true);
  const [mini, setMini] = useState(false);
  const [far, setFar] = useState(false);
  const [navHeight, setNavHeight] = useState(NAV_ESTIMATE);
  const blurTargetRef = useRef<RNView>(null);
  const loading = useFakeLoading();

  const onScroll = useAnimatedScrollHandler({
    onScroll: (e) => {
      const y = e.contentOffset.y;
      const dy = y - lastY.value;

      const nextFar = y > FAR_AT;
      if (nextFar !== farSV.value) {
        farSV.value = nextFar;
        runOnJS(setFar)(nextFar);
      }

      atTopSV.value = y < SHRINK_AT;

      let nextMini = miniSV.value;
      if (y < SHRINK_AT)
        nextMini = false;
      else if (dy > DIR_HYST)
        nextMini = true;
      else if (dy < -DIR_HYST)
        nextMini = false;
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
    <View className="flex-1">
      <StatusBar style="light" />
      <BlurTargetView ref={blurTargetRef} style={{ flex: 1 }}>
        <Animated.ScrollView
          ref={scrollRef}
          onScroll={onScroll}
          scrollEventThrottle={16}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingTop: navHeight, paddingBottom: 120 }}
        >
          {loading
            ? (
                <HomeScreenSkeleton />
              )
            : (
                <View className="bg-neutral-50 pb-4">
                  <Tagline />
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
              )}
        </Animated.ScrollView>
      </BlurTargetView>
      <Navbar
        hidden={miniSV}
        atTop={atTopSV}
        onHeight={setNavHeight}
        blurTarget={blurTargetRef}
      />
      <BottomNav
        mini={mini}
        showScrollTop={far}
        onScrollToTop={scrollToTop}
        blurTarget={blurTargetRef}
      />
    </View>
  );
}
