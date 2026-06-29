import type { ReactNode } from 'react';
import type { ViewStyle } from 'react-native';
import { createContext, use, useEffect } from 'react';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useSharedValue,
  withRepeat,
  withTiming,
} from 'react-native-reanimated';

import { View } from '@/components/ui';

const PulseContext = createContext<ReturnType<typeof useAnimatedStyle<ViewStyle>> | null>(null);

function SkeletonProvider({ children }: { children: ReactNode }) {
  const progress = useSharedValue(0.5);
  useEffect(() => {
    progress.set(
      withRepeat(
        withTiming(1, { duration: 850, easing: Easing.inOut(Easing.ease) }),
        -1,
        true,
      ),
    );
    return () => cancelAnimation(progress);
  }, [progress]);
  const pulse = useAnimatedStyle<ViewStyle>(() => ({ opacity: progress.get() }));
  return <PulseContext value={pulse}>{children}</PulseContext>;
}

function Skeleton({ className = '' }: { className?: string }) {
  const pulse = use(PulseContext);
  return <Animated.View style={pulse} className={`bg-neutral-200 ${className}`} />;
}

function ProductCardSkeleton() {
  return (
    <View className="w-full gap-2.5 overflow-hidden rounded-2xl border border-neutral-200 bg-white px-2 pt-2 pb-3">
      <Skeleton className="h-[149px] rounded-xl" />
      <View className="gap-2">
        <Skeleton className="h-4 w-3/4 rounded-sm" />
        <Skeleton className="h-3 w-12 rounded-sm" />
        <Skeleton className="h-4 w-16 rounded-sm" />
      </View>
      <Skeleton className="h-[42px] rounded-xl" />
    </View>
  );
}

function TaglineSkeleton() {
  return (
    <View className="items-center bg-secondary-950 py-4">
      <Skeleton className="h-4 w-56 rounded-sm bg-white/20" />
      <Skeleton className="mt-1 h-3 w-60 rounded-sm bg-white/15" />
    </View>
  );
}

function StoriesRowSkeleton() {
  return (
    <View className="mt-4 flex-row gap-3 overflow-hidden px-4">
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
      <View className="w-20 items-center gap-1.5">
        <Skeleton className="size-[72px] rounded-full" />
        <Skeleton className="h-3 w-14 rounded-sm" />
      </View>
    </View>
  );
}

function FeaturedRailSkeleton() {
  return (
    <View className="mt-6 flex-row gap-4 overflow-hidden px-4">
      <View className="relative h-[384px] w-[320px] overflow-hidden rounded-3xl bg-neutral-400">
        <View className="absolute inset-x-4 top-4 gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full bg-white/40" />
          <Skeleton className="h-6 w-3/4 rounded-sm bg-white/40" />
          <Skeleton className="h-3 w-full rounded-sm bg-white/30" />
          <Skeleton className="h-3 w-2/3 rounded-sm bg-white/30" />
        </View>
        <View className="absolute inset-x-4 bottom-4 flex-row items-center justify-between">
          <Skeleton className="h-9 w-36 rounded-[22px] bg-white/40" />
          <View className="flex-row gap-3">
            <Skeleton className="size-9 rounded-full bg-white/40" />
            <Skeleton className="size-9 rounded-full bg-white/40" />
          </View>
        </View>
      </View>
      <View className="relative h-[384px] w-[320px] overflow-hidden rounded-3xl bg-neutral-400">
        <View className="absolute inset-x-4 top-4 gap-1.5">
          <Skeleton className="h-5 w-16 rounded-full bg-white/40" />
          <Skeleton className="h-6 w-3/4 rounded-sm bg-white/40" />
          <Skeleton className="h-3 w-full rounded-sm bg-white/30" />
          <Skeleton className="h-3 w-2/3 rounded-sm bg-white/30" />
        </View>
        <View className="absolute inset-x-4 bottom-4 flex-row items-center justify-between">
          <Skeleton className="h-9 w-36 rounded-[22px] bg-white/40" />
          <View className="flex-row gap-3">
            <Skeleton className="size-9 rounded-full bg-white/40" />
            <Skeleton className="size-9 rounded-full bg-white/40" />
          </View>
        </View>
      </View>
    </View>
  );
}

function TrendingGridSkeleton() {
  return (
    <View className="mt-8 gap-2">
      <View className="flex-row items-center justify-between px-4">
        <Skeleton className="h-5 w-48 rounded-sm" />
        <Skeleton className="h-7 w-24 rounded-md" />
      </View>

      <View className="h-[344px] flex-row gap-4 px-4">
        <Skeleton className="h-full flex-1 rounded-xl" />

        <View className="w-[157px] gap-2">
          <Skeleton className="h-[167px] rounded-xl" />
          <Skeleton className="h-[167px] rounded-xl" />
        </View>
      </View>
    </View>
  );
}

function LiveVideoSkeleton() {
  return (
    <View className="mx-4 mt-8">
      <Skeleton className="aspect-361/722 w-full rounded-3xl" />
    </View>
  );
}

function PromoBannerSkeleton() {
  return (
    <View className="mt-8 w-full gap-4 bg-gold-500 p-5">
      <Skeleton className="h-3 w-40 self-center rounded-sm bg-white/40" />
      <Skeleton className="h-16 w-full rounded-2xl bg-white/40" />
      <View className="flex-row gap-4 overflow-hidden">
        <Skeleton className="h-[330px] w-[290px] rounded-2xl bg-white/40" />
        <Skeleton className="h-[330px] w-[290px] rounded-2xl bg-white/40" />
        <Skeleton className="h-[330px] w-[290px] rounded-2xl bg-white/40" />
      </View>
      <Skeleton className="h-6 w-3/4 self-center rounded-sm bg-white/40" />
      <Skeleton className="h-12 w-full rounded-xl bg-white/40" />
      <Skeleton className="h-3 w-40 self-center rounded-sm bg-white/40" />
    </View>
  );
}

function RailSkeleton() {
  return (
    <View className="mt-8">
      <View className="gap-2 px-4">
        <View className="flex-row items-center justify-between">
          <Skeleton className="h-5 w-40 rounded-sm" />
          <Skeleton className="h-10 w-28 rounded-xl" />
        </View>
        <Skeleton className="h-3 w-64 rounded-sm" />
      </View>
      <View className="flex-row gap-3 overflow-hidden px-4 pt-3.5">
        <View className="w-[165px]">
          <ProductCardSkeleton />
        </View>
        <View className="w-[165px]">
          <ProductCardSkeleton />
        </View>
        <View className="w-[165px]">
          <ProductCardSkeleton />
        </View>
      </View>
    </View>
  );
}

function DiscoverSkeleton() {
  return (
    <View className="mt-8 gap-6 px-4">
      <View className="gap-4">
        <View className="gap-1.5">
          <Skeleton className="h-3 w-32 rounded-sm" />
          <Skeleton className="h-7 w-40 rounded-sm" />
          <Skeleton className="h-3 w-64 rounded-sm" />
        </View>

        <View className="flex-row gap-1 rounded-full bg-neutral-100 p-1">
          <Skeleton className="h-9 flex-1 rounded-full" />
          <Skeleton className="h-9 flex-1 rounded-full" />
        </View>
      </View>

      <View className="gap-3">
        <View className="flex-row items-center gap-3.5 rounded-2xl border border-neutral-200 bg-white p-3">
          <Skeleton className="h-[126px] w-[116px] rounded-xl" />
          <View className="flex-1 gap-2">
            <Skeleton className="h-5 w-24 rounded-sm" />
            <Skeleton className="h-5 w-32 rounded-sm" />
            <Skeleton className="h-4 w-20 rounded-sm" />
            <Skeleton className="h-9 w-24 rounded-[10px]" />
          </View>
        </View>

        <View className="gap-3">
          <View className="flex-row items-center justify-between">
            <Skeleton className="h-4 w-40 rounded-sm" />
            <Skeleton className="h-3 w-12 rounded-sm" />
          </View>

          <View className="flex-row flex-wrap gap-2">
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
            <Skeleton className="h-8 w-20 rounded-full" />
          </View>

          <View className="flex-row flex-wrap justify-between gap-y-[15px]">
            <View className="w-[48%]">
              <ProductCardSkeleton />
            </View>
            <View className="w-[48%]">
              <ProductCardSkeleton />
            </View>
            <View className="w-[48%]">
              <ProductCardSkeleton />
            </View>
            <View className="w-[48%]">
              <ProductCardSkeleton />
            </View>
          </View>
        </View>
      </View>
    </View>
  );
}

function TrustedBrandsSkeleton() {
  return (
    <View className="w-full gap-6 bg-white py-8">
      <View className="items-center gap-1.5 px-4">
        <Skeleton className="h-6 w-40 rounded-sm" />
        <Skeleton className="h-3 w-56 rounded-sm" />
      </View>

      <View className="flex-row gap-3 overflow-hidden px-4">
        <Skeleton className="size-16 rounded-2xl" />
        <Skeleton className="size-16 rounded-2xl" />
        <Skeleton className="size-16 rounded-2xl" />
        <Skeleton className="size-16 rounded-2xl" />
        <Skeleton className="size-16 rounded-2xl" />
        <Skeleton className="size-16 rounded-2xl" />
      </View>
    </View>
  );
}

function VerifiedSellersSkeleton() {
  return (
    <View className="mt-8 w-full gap-4">
      <View className="flex-row items-center justify-between px-4">
        <View className="flex-row items-center gap-2">
          <Skeleton className="size-6 rounded-sm" />
          <Skeleton className="h-5 w-40 rounded-sm" />
        </View>
        <Skeleton className="h-4 w-16 rounded-sm" />
      </View>

      <View className="flex-row gap-4 overflow-hidden px-4">
        {[0, 1].map(card => (
          <View
            key={card}
            className="w-[330px] gap-4 rounded-2xl border border-neutral-200 bg-white p-4"
          >
            <View className="flex-row items-center gap-3">
              <Skeleton className="size-12 rounded-full" />
              <View className="flex-1 gap-1">
                <Skeleton className="h-4 w-28 rounded-sm" />
                <Skeleton className="h-3 w-20 rounded-sm" />
              </View>
              <Skeleton className="size-6 rounded-sm" />
            </View>

            <Skeleton className="h-5 w-24 self-start rounded-full" />

            <View className="gap-2">
              {[0, 1].map(row => (
                <View key={row} className="flex-row gap-2">
                  <Skeleton className="h-[145px] flex-1 rounded-xl" />
                  <Skeleton className="h-[145px] flex-1 rounded-xl" />
                </View>
              ))}
            </View>

            <Skeleton className="h-11 rounded-[10px]" />
          </View>
        ))}
      </View>
    </View>
  );
}

function SellerCtaSkeleton() {
  return (
    <View className="mx-4 mt-8">
      <View className="overflow-hidden rounded-2xl bg-secondary-950 px-6 py-7">
        <Skeleton className="h-3 w-28 rounded-sm bg-white/15" />
        <Skeleton className="mt-2.5 h-6 w-3/4 rounded-sm bg-white/15" />
        <Skeleton className="mt-2.5 h-3 w-full rounded-sm bg-white/15" />
        <Skeleton className="mt-1 h-3 w-2/3 rounded-sm bg-white/15" />

        <View className="mt-3 gap-3.5">
          <View className="flex-row items-center gap-3">
            <Skeleton className="size-9 rounded-full bg-white/15" />
            <Skeleton className="h-4 flex-1 rounded-sm bg-white/15" />
          </View>
          <View className="flex-row items-center gap-3">
            <Skeleton className="size-9 rounded-full bg-white/15" />
            <Skeleton className="h-4 flex-1 rounded-sm bg-white/15" />
          </View>
          <View className="flex-row items-center gap-3">
            <Skeleton className="size-9 rounded-full bg-white/15" />
            <Skeleton className="h-4 flex-1 rounded-sm bg-white/15" />
          </View>
        </View>

        <Skeleton className="mt-6 h-12 rounded-xl bg-white/15" />
      </View>
    </View>
  );
}

export function HomeScreenSkeleton() {
  return (
    <SkeletonProvider>
      <View className="bg-neutral-50 pb-4">
        <TaglineSkeleton />
        <StoriesRowSkeleton />
        <FeaturedRailSkeleton />
        <TrendingGridSkeleton />
        <LiveVideoSkeleton />
        <PromoBannerSkeleton />
        <RailSkeleton />
        <RailSkeleton />
        <DiscoverSkeleton />
        <TrustedBrandsSkeleton />
        <VerifiedSellersSkeleton />
        <SellerCtaSkeleton />
      </View>
    </SkeletonProvider>
  );
}
