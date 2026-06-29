import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SharedValue } from 'react-native-reanimated';
import type { Story } from '@/features/home/data';
import { LinearGradient } from 'expo-linear-gradient';
import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { Share, StyleSheet, useWindowDimensions } from 'react-native';
import { Gesture, GestureDetector } from 'react-native-gesture-handler';
import Animated, {
  cancelAnimation,
  Easing,
  Extrapolation,
  interpolate,
  runOnJS,
  useAnimatedStyle,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, Text, View } from '@/components/ui';
import { stories } from '@/features/home/data';
import { Icon } from './icon';
import { LiveProductsModal } from './live-products-modal';

const DURATION = 5000;
const WHITE = '#ffffff';
const PERSP = 850;

export function StoryViewer({ startId }: { startId?: string }) {
  const insets = useSafeAreaInsets();
  const { width } = useWindowDimensions();
  const productsRef = React.useRef<BottomSheetModal>(null);
  const [paused, setPaused] = React.useState(false);

  const close = React.useCallback(() => router.back(), []);
  const nav = useStoreNav(startId, close);
  const progress = useStoryTimer({
    storeIndex: nav.storeIndex,
    frameIndex: nav.frameIndex,
    runId: nav.runId,
    paused,
    onComplete: nav.goNext,
  });
  const swipe = useSwipeToClose(close);

  const pause = React.useCallback(() => setPaused(true), []);
  const resume = React.useCallback(() => setPaused(false), []);
  const store = stories[nav.storeIndex];
  const prev = stories[nav.storeIndex - 1];
  const next = stories[nav.storeIndex + 1];
  const share = React.useCallback(() => {
    setPaused(true);
    Share.share({ message: `Check out ${store.label}` }).finally(() => setPaused(false));
  }, [store.label]);
  const openProducts = React.useCallback(() => {
    setPaused(true);
    productsRef.current?.present();
  }, []);

  return (
    <View className="flex-1">
      <StatusBar style="light" />
      <Animated.View
        pointerEvents="none"
        style={[StyleSheet.absoluteFill, styles.black, swipe.backdropStyle]}
      />

      <CubeStage
        key={nav.storeIndex}
        store={store}
        prev={prev}
        next={next}
        storeIndex={nav.storeIndex}
        frameIndex={nav.frameIndex}
        lastStore={nav.lastStore}
        width={width}
        swipePan={swipe.pan}
        contentStyle={swipe.contentStyle}
        progress={progress}
        insetTop={insets.top}
        insetBottom={insets.bottom}
        onStore={nav.goStore}
        onPrev={nav.goPrev}
        onNext={nav.goNext}
        onPause={pause}
        onResume={resume}
        onClose={close}
        onProducts={openProducts}
        onShare={share}
      />

      <LiveProductsModal ref={productsRef} onDismiss={resume} />
    </View>
  );
}

function CubeStage({
  store,
  prev,
  next,
  storeIndex,
  frameIndex,
  lastStore,
  width,
  swipePan,
  contentStyle,
  progress,
  insetTop,
  insetBottom,
  onStore,
  onPrev,
  onNext,
  onPause,
  onResume,
  onClose,
  onProducts,
  onShare,
}: {
  store: Story;
  prev?: Story;
  next?: Story;
  storeIndex: number;
  frameIndex: number;
  lastStore: number;
  width: number;
  swipePan: ReturnType<typeof useSwipeToClose>['pan'];
  contentStyle: ReturnType<typeof useSwipeToClose>['contentStyle'];
  progress: SharedValue<number>;
  insetTop: number;
  insetBottom: number;
  onStore: (dir: 1 | -1) => void;
  onPrev: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onClose: () => void;
  onProducts: () => void;
  onShare: () => void;
}) {
  const cube = useStoryCube({ storeIndex, lastStore, width, onStore, onPause, onResume });
  const gesture = Gesture.Race(swipePan, cube.pan);

  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[styles.content, contentStyle]}>
        {prev ? <CubeFace x={cube.x} width={width} position={-1} source={prev.frames[0]} /> : null}
        {next ? <CubeFace x={cube.x} width={width} position={1} source={next.frames[0]} /> : null}

        <CenterFace
          x={cube.x}
          width={width}
          source={store.frames[frameIndex]}
          store={store}
          frameIndex={frameIndex}
          progress={progress}
          insetTop={insetTop}
          insetBottom={insetBottom}
          onPrev={onPrev}
          onNext={onNext}
          onPause={onPause}
          onResume={onResume}
          onClose={onClose}
          onProducts={onProducts}
          onShare={onShare}
        />
      </Animated.View>
    </GestureDetector>
  );
}

function useStoreNav(startId: string | undefined, close: () => void) {
  const lastStore = stories.length - 1;
  const [storeIndex, setStoreIndex] = React.useState(() => {
    const i = stories.findIndex(s => s.id === startId);
    return i < 0 ? 0 : i;
  });
  const [frameIndex, setFrameIndex] = React.useState(0);
  const [runId, setRunId] = React.useState(0);

  const goNext = React.useCallback(() => {
    if (frameIndex < stories[storeIndex].frames.length - 1) {
      setFrameIndex(frameIndex + 1);
    }
    else if (storeIndex < lastStore) {
      setStoreIndex(storeIndex + 1);
      setFrameIndex(0);
    }
    else {
      close();
    }
  }, [storeIndex, frameIndex, lastStore, close]);

  const goPrev = React.useCallback(() => {
    if (frameIndex > 0) {
      setFrameIndex(frameIndex - 1);
    }
    else if (storeIndex > 0) {
      setStoreIndex(storeIndex - 1);
      setFrameIndex(0);
    }
    else {
      setRunId(n => n + 1);
    }
  }, [storeIndex, frameIndex]);

  const goStore = React.useCallback((dir: 1 | -1) => {
    const t = storeIndex + dir;
    if (t < 0 || t > lastStore)
      return;
    setStoreIndex(t);
    setFrameIndex(0);
    setRunId(n => n + 1);
  }, [storeIndex, lastStore]);

  return { storeIndex, frameIndex, runId, lastStore, goNext, goPrev, goStore };
}

function useStoryTimer({
  storeIndex,
  frameIndex,
  runId,
  paused,
  onComplete,
}: {
  storeIndex: number;
  frameIndex: number;
  runId: number;
  paused: boolean;
  onComplete: () => void;
}) {
  const progress = useSharedValue(0);
  const frameKeyRef = React.useRef('');
  const completedKeyRef = React.useRef<string | null>(null);

  const complete = React.useCallback((key: string) => {
    if (completedKeyRef.current === key)
      return;
    completedKeyRef.current = key;
    onComplete();
  }, [onComplete]);

  React.useEffect(() => {
    const key = `${storeIndex}:${frameIndex}:${runId}`;
    const fresh = frameKeyRef.current !== key;
    frameKeyRef.current = key;
    if (fresh) {
      progress.value = 0;
      completedKeyRef.current = null;
    }
    if (paused) {
      cancelAnimation(progress);
      return;
    }
    const remaining = (1 - progress.value) * DURATION;
    if (remaining < 16) {
      complete(key);
      return;
    }
    progress.value = withTiming(1, { duration: remaining, easing: Easing.linear }, (f) => {
      if (f)
        runOnJS(complete)(key);
    });
    return () => cancelAnimation(progress);
  }, [storeIndex, frameIndex, runId, paused, onComplete, complete, progress]);

  return progress;
}

function useStoryCube({
  storeIndex,
  lastStore,
  width,
  onStore,
  onPause,
  onResume,
}: {
  storeIndex: number;
  lastStore: number;
  width: number;
  onStore: (dir: 1 | -1) => void;
  onPause: () => void;
  onResume: () => void;
}) {
  const x = useSharedValue(0);

  const pan = Gesture.Pan()
    .activeOffsetX([-16, 16])
    .failOffsetY([-14, 14])
    .onStart(() => {
      runOnJS(onPause)();
    })
    .onUpdate((e) => {
      const atStart = storeIndex === 0;
      const atEnd = storeIndex === lastStore;
      const tx = e.translationX;
      x.value = (atStart && tx > 0) || (atEnd && tx < 0) ? tx * 0.25 : tx;
    })
    .onEnd((e) => {
      const wantNext = e.translationX < -width * 0.3 || e.velocityX < -800;
      const wantPrev = e.translationX > width * 0.3 || e.velocityX > 800;
      if (wantNext && storeIndex < lastStore) {
        x.value = withTiming(-width, { duration: 260 }, (f) => {
          if (f)
            runOnJS(onStore)(1);
        });
      }
      else if (wantPrev && storeIndex > 0) {
        x.value = withTiming(width, { duration: 260 }, (f) => {
          if (f)
            runOnJS(onStore)(-1);
        });
      }
      else {
        x.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
      }
    })
    .onFinalize(() => {
      runOnJS(onResume)();
    });

  return { x, pan };
}

function useSwipeToClose(onClose: () => void) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const backdrop = useSharedValue(1);

  const pan = Gesture.Pan()
    .activeOffsetY(12)
    .failOffsetX([-20, 20])
    .onUpdate((e) => {
      translateY.value = Math.max(0, e.translationY);
      backdrop.value = interpolate(translateY.value, [0, height], [1, 0], Extrapolation.CLAMP);
    })
    .onEnd((e) => {
      if (e.translationY > 120 || e.velocityY > 800) {
        translateY.value = withTiming(height, { duration: 220 });
        backdrop.value = withTiming(0, { duration: 220 }, (f) => {
          if (f)
            runOnJS(onClose)();
        });
      }
      else {
        translateY.value = withTiming(0, { duration: 220, easing: Easing.out(Easing.cubic) });
        backdrop.value = withTiming(1, { duration: 220, easing: Easing.out(Easing.cubic) });
      }
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderRadius: interpolate(translateY.value, [0, 140], [0, 28], Extrapolation.CLAMP),
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  return { pan, contentStyle, backdropStyle };
}

function CubeFace({
  x,
  width,
  position,
  source,
}: {
  x: SharedValue<number>;
  width: number;
  position: -1 | 1;
  source: string;
}) {
  const style = useAnimatedStyle(() => {
    const local = position + x.value / width;
    const rotateY = interpolate(local, [-1, 0, 1], [-90, 0, 90], Extrapolation.CLAMP);
    const translateX = interpolate(local, [-1, 0, 1], [-width, 0, width], Extrapolation.CLAMP);
    const opacity = interpolate(Math.abs(local), [0, 1], [1, 0.35], Extrapolation.CLAMP);
    const transformOrigin = position < 0 ? '100% 50%' : '0% 50%';
    return { opacity, transformOrigin, transform: [{ perspective: PERSP }, { translateX }, { rotateY: `${rotateY}deg` }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} contentFit="cover" transition={200} className="absolute inset-0 size-full" />
      <Scrims />
    </Animated.View>
  );
}

function CenterFace({
  x,
  width,
  source,
  store,
  frameIndex,
  progress,
  insetTop,
  insetBottom,
  onPrev,
  onNext,
  onPause,
  onResume,
  onClose,
  onProducts,
  onShare,
}: {
  x: SharedValue<number>;
  width: number;
  source: string;
  store: Story;
  frameIndex: number;
  progress: SharedValue<number>;
  insetTop: number;
  insetBottom: number;
  onPrev: () => void;
  onNext: () => void;
  onPause: () => void;
  onResume: () => void;
  onClose: () => void;
  onProducts: () => void;
  onShare: () => void;
}) {
  const style = useAnimatedStyle(() => {
    const local = x.value / width;
    const rotateY = interpolate(local, [-1, 0, 1], [-90, 0, 90], Extrapolation.CLAMP);
    const translateX = interpolate(local, [-1, 0, 1], [-width, 0, width], Extrapolation.CLAMP);
    const transformOrigin = local < 0 ? '100% 50%' : '0% 50%';
    return { transformOrigin, transform: [{ perspective: PERSP }, { translateX }, { rotateY: `${rotateY}deg` }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} contentFit="cover" transition={200} className="absolute inset-0 size-full" />
      <Scrims />

      <Button
        variant="ghost"
        className="absolute inset-y-0 left-0 my-0 h-auto w-[40%] rounded-none px-0"
        onPress={onPrev}
        onLongPress={onPause}
        delayLongPress={220}
        onPressOut={onResume}
      />
      <Button
        variant="ghost"
        className="absolute inset-y-0 right-0 my-0 h-auto w-[60%] rounded-none px-0"
        onPress={onNext}
        onLongPress={onPause}
        delayLongPress={220}
        onPressOut={onResume}
      />

      <TopBar
        store={store}
        frameIndex={frameIndex}
        progress={progress}
        insetTop={insetTop}
        onClose={onClose}
      />
      <BottomBar insetBottom={insetBottom} onProducts={onProducts} onShare={onShare} />
    </Animated.View>
  );
}

function Scrims() {
  return (
    <>
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0.62)', 'rgba(0,0,0,0)'] as const}
        style={styles.topScrim}
      />
      <LinearGradient
        pointerEvents="none"
        colors={['rgba(0,0,0,0)', 'rgba(0,0,0,0.9)'] as const}
        style={styles.bottomScrim}
      />
    </>
  );
}

function TopBar({
  store,
  frameIndex,
  progress,
  insetTop,
  onClose,
}: {
  store: Story;
  frameIndex: number;
  progress: SharedValue<number>;
  insetTop: number;
  onClose: () => void;
}) {
  return (
    <View
      pointerEvents="box-none"
      style={{ paddingTop: insetTop + 8 }}
      className="absolute inset-x-0 top-0 px-4"
    >
      <View pointerEvents="none" className="h-[3px] flex-row gap-1">
        {store.frames.map((src, i) => (
          <Segment key={src} i={i} index={frameIndex} progress={progress} />
        ))}
      </View>

      <View pointerEvents="box-none" className="mt-3 h-10 flex-row items-center justify-between">
        <View pointerEvents="none" className="flex-row items-center gap-2.5">
          <View className="size-10 items-center justify-center rounded-full border-2 border-gold-500">
            <Image source={store.image} contentFit="cover" className="size-8 rounded-full" />
          </View>
          <View>
            <Text variant="subheadline" emphasized className="text-white">
              {store.label}
            </Text>
            <Text variant="caption-1" className="text-white/80">
              3h
            </Text>
          </View>
        </View>
        <RoundButton size={32} icon="x" label="Close story" onPress={onClose} />
      </View>

      <StoryLabels store={store} />
    </View>
  );
}

function StoryLabels({ store }: { store: Story }) {
  const { tag, discount, watching, endsInSec } = store;
  if (!tag)
    return null;
  return (
    <View pointerEvents="none" className="mt-3 flex-row items-center justify-between">
      <View className="flex-row items-center gap-2">
        {tag === 'hot' && (
          <>
            <Badge className="bg-primary-500" textClassName="text-neutral-900">HOT</Badge>
            {!!discount && <Badge className="bg-error-500">{discount}</Badge>}
          </>
        )}
        {tag === 'new' && <Badge className="bg-primary-500" textClassName="text-neutral-900">NEW</Badge>}
        {tag === 'live' && (
          <View className="flex-row items-center gap-1 rounded-full bg-error-500 py-[5px] pr-2.5 pl-2">
            <View className="size-1.5 rounded-full bg-white" />
            <Text variant="caption-2" emphasized className="tracking-[0.66px] text-white">LIVE</Text>
          </View>
        )}
      </View>

      {tag === 'hot' && endsInSec != null && <Countdown seconds={endsInSec} />}
      {tag === 'live' && !!watching && <GlassPill>{`${watching} watching`}</GlassPill>}
    </View>
  );
}

function Badge({ className, textClassName = 'text-white', children }: { className: string; textClassName?: string; children: string }) {
  return (
    <View className={`rounded-full px-2.5 py-[5px] ${className}`}>
      <Text variant="caption-2" emphasized className={`tracking-[0.66px] ${textClassName}`}>{children}</Text>
    </View>
  );
}

function GlassPill({ children }: { children: React.ReactNode }) {
  return (
    <View className="rounded-full border border-white/20 bg-black/40 px-2.5 py-[5px]">
      <Text variant="caption-2" emphasized className="tracking-[0.22px] text-white">{children}</Text>
    </View>
  );
}

function Countdown({ seconds }: { seconds: number }) {
  const [left, setLeft] = React.useState(seconds);
  React.useEffect(() => {
    const id = setInterval(() => setLeft(s => (s > 0 ? s - 1 : 0)), 1000);
    return () => clearInterval(id);
  }, []);
  const mm = String(Math.floor(left / 60)).padStart(2, '0');
  const ss = String(left % 60).padStart(2, '0');
  return <GlassPill>{`Ends in ${mm}:${ss}`}</GlassPill>;
}

function BottomBar({
  insetBottom,
  onProducts,
  onShare,
}: {
  insetBottom: number;
  onProducts: () => void;
  onShare: () => void;
}) {
  return (
    <View
      pointerEvents="box-none"
      style={{ paddingBottom: insetBottom + 16 }}
      className="absolute inset-x-0 bottom-0 flex-row items-center justify-between px-4"
    >
      <RoundButton size={48} icon="shopping-bag" label="View products" onPress={onProducts} />
      <RoundButton size={48} icon="share-2" label="Share story" onPress={onShare} />
    </View>
  );
}

function RoundButton({
  size,
  icon,
  label,
  onPress,
}: {
  size: number;
  icon: 'x' | 'shopping-bag' | 'share-2';
  label: string;
  onPress: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: size, height: size }}
      className="my-0 h-auto items-center justify-center rounded-full border border-white/20 bg-black/30 px-0 active:opacity-80"
    >
      <Icon name={icon} size={size <= 32 ? 18 : 22} color={WHITE} />
    </Button>
  );
}

function Segment({
  i,
  index,
  progress,
}: {
  i: number;
  index: number;
  progress: SharedValue<number>;
}) {
  const fill = useAnimatedStyle(() => {
    const w = i < index ? 1 : i === index ? progress.value : 0;
    return { width: `${w * 100}%` };
  });
  return (
    <View className="h-full flex-1 overflow-hidden rounded-full bg-white/30">
      <Animated.View style={[styles.fill, fill]} />
    </View>
  );
}

const styles = StyleSheet.create({
  black: { backgroundColor: '#000' },
  content: { flex: 1, overflow: 'hidden', backgroundColor: '#0a0d12' },
  fill: { height: '100%', backgroundColor: '#fff', borderRadius: 2 },
  topScrim: { position: 'absolute', left: 0, right: 0, top: 0, height: '25%' },
  bottomScrim: { position: 'absolute', left: 0, right: 0, bottom: 0, height: '44%' },
});
