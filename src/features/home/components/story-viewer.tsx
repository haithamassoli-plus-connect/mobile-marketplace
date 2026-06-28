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
  withSpring,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, Pressable, Text, View } from '@/components/ui';
import { stories } from '@/features/home/data';
import { Icon } from './icon';
import { LiveProductsModal } from './live-products-modal';

const DURATION = 5000; // ms per story frame
const WHITE = '#ffffff';
const PERSP = 850; // cube perspective

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

      {/* Keyed by storeIndex: the cube's drag value (x) is recreated fresh (=0) in the
          SAME commit that the new store renders, so a committed swipe lands with no
          one-frame flash of the old store (no in-worklet reset needed). */}
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

// One store's cube faces + the composed gesture. The parent keys this on storeIndex so
// useStoryCube's `x` remounts to 0 atomically with the new store. The vertical
// swipe-to-close Pan (from the parent) races the horizontal cube Pan; taps fall through.
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

// Store + frame state machine. Guard and write read the SAME render snapshot (deps on
// storeIndex/frameIndex) and write plain values — so a duplicated synchronous advance
// (tap racing the timer) is idempotent: no overflow past the end, no skipped frame.
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
      setStoreIndex(storeIndex + 1); // auto-advance across stores = instant jump, no cube
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
    } // first frame of first store → restart
  }, [storeIndex, frameIndex]);

  // Committed cube swipe: jump one store, reset to frame 0, restart the timer.
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

// Auto-advancing progress for the active frame. progress is mutated ONLY in this effect
// (the repo's reanimated pattern — see bottom-nav.tsx). completedKeyRef dedupes the
// completion per (store,frame,runId) and we never re-arm a 0ms timer.
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
    const remaining = (1 - progress.value) * DURATION; // resume from where we paused
    if (remaining < 16) { // already (essentially) done — advance, never re-arm 0ms
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

// Horizontal cube swipe. x is mutated ONLY inside this Pan worklet — never in an effect.
// On commit we finish the rotation to ±width and let the parent remount this stage
// (key=storeIndex) so a fresh x=0 lands with the new store — no flash, no worklet reset.
// The frame timer is paused for the duration of the swipe (onStart → onFinalize).
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
    .activeOffsetX([-16, 16]) // horizontal intent
    .failOffsetY([-14, 14]) // let swipe-to-close win on vertical drags
    .onStart(() => {
      runOnJS(onPause)();
    })
    .onUpdate((e) => {
      const atStart = storeIndex === 0;
      const atEnd = storeIndex === lastStore;
      const tx = e.translationX;
      // rubber-band at the ends (no prev before first / next after last)
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
        x.value = withSpring(0, { damping: 18 });
      }
    })
    .onFinalize(() => {
      runOnJS(onResume)();
    });

  return { x, pan };
}

// Swipe-down-to-close: drag follows the finger, backdrop fades to reveal the screen
// behind; release past the threshold slides out and calls onClose. translateY/backdrop
// are mutated only inside the gesture worklet (never an effect) to satisfy react-hooks.
function useSwipeToClose(onClose: () => void) {
  const { height } = useWindowDimensions();
  const translateY = useSharedValue(0);
  const backdrop = useSharedValue(1);

  const pan = Gesture.Pan()
    .activeOffsetY(12) // downward drag only; taps fall through to the zones
    .failOffsetX([-20, 20]) // a sideways drag releases this Pan to the cube
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
        translateY.value = withSpring(0, { damping: 18 });
        backdrop.value = withSpring(1);
      }
    });

  const contentStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
    borderRadius: interpolate(translateY.value, [0, 140], [0, 28], Extrapolation.CLAMP),
  }));
  const backdropStyle = useAnimatedStyle(() => ({ opacity: backdrop.value }));

  return { pan, contentStyle, backdropStyle };
}

// Neighbour cube face — just a cover + scrims. `local` is 0 when this face is centered.
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
    return { opacity, transform: [{ perspective: PERSP }, { translateX }, { rotateY: `${rotateY}deg` }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} contentFit="cover" transition={200} className="absolute inset-0 size-full" />
      <Scrims />
    </Animated.View>
  );
}

// The active face: same cube transform (centered at rest) plus every interactive layer.
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
    return { transform: [{ perspective: PERSP }, { translateX }, { rotateY: `${rotateY}deg` }] };
  });
  return (
    <Animated.View style={[StyleSheet.absoluteFill, style]}>
      <Image source={source} contentFit="cover" transition={200} className="absolute inset-0 size-full" />
      <Scrims />

      {/* Tap zones: left 40% = previous, right 60% = next; hold to pause */}
      <Pressable
        className="absolute inset-y-0 left-0 w-[40%]"
        onPress={onPrev}
        onLongPress={onPause}
        delayLongPress={220}
        onPressOut={onResume}
      />
      <Pressable
        className="absolute inset-y-0 right-0 w-[60%]"
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

// Top + bottom legibility gradients, per Figma 508:1547 (black 0.62→0, ~25% tall) and
// 508:1548 (0→black 0.9, ~44% tall). `as const` satisfies LinearGradient's color tuple type.
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
      {/* One segment per frame of the active store (keyed by store id → remounts on jump) */}
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
            {/* ponytail: data has no timestamp — static label to match the design. */}
            <Text variant="caption-1" className="text-white/80">
              3h
            </Text>
          </View>
        </View>
        <RoundButton size={32} icon="x" label="Close story" onPress={onClose} />
      </View>
    </View>
  );
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
    <Pressable
      onPress={onPress}
      hitSlop={8}
      accessibilityRole="button"
      accessibilityLabel={label}
      style={{ width: size, height: size }}
      className="items-center justify-center rounded-full border border-white/20 bg-black/30 active:opacity-80"
    >
      <Icon name={icon} size={size <= 32 ? 18 : 22} color={WHITE} />
    </Pressable>
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
