import type { ViewStyle } from 'react-native';
import type { ComposedGesture, GestureType } from 'react-native-gesture-handler';
import type { AnimatedStyle, SharedValue } from 'react-native-reanimated';
import { Image as ExpoImage } from 'expo-image';
import { StatusBar } from 'expo-status-bar';
import * as React from 'react';
import { AccessibilityInfo, Dimensions, Modal, StyleSheet } from 'react-native';
import { Gesture, GestureDetector, GestureHandlerRootView } from 'react-native-gesture-handler';
import Animated, {
  clamp,
  useAnimatedStyle,
  useDerivedValue,
  useReducedMotion,
  useSharedValue,
  withTiming,
} from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { scheduleOnRN } from 'react-native-worklets';

import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const { width: W, height: H } = Dimensions.get('window');
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DISMISS_DISTANCE = H * 0.2;
const DISMISS_VELOCITY = 800;

export type ImageViewerProps = {
  images: string[];
  visible: boolean;
  initialIndex?: number;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
};

export function ImageViewer({
  images,
  visible,
  initialIndex = 0,
  onClose,
  onIndexChange,
}: ImageViewerProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const v = useViewer({ images, initialIndex, reduce, onClose, onIndexChange, visible });

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      <GestureHandlerRootView style={styles.flex}>
        <StatusBar style="light" />
        <Animated.View
          accessibilityViewIsModal
          pointerEvents="none"
          style={[StyleSheet.absoluteFill, styles.black, v.bgStyle]}
        />

        <ViewerPager
          images={images}
          active={v.active}
          gesture={v.gesture}
          rowStyle={v.rowStyle}
          imgStyle={v.imgStyle}
          reduce={reduce}
        />

        {v.chrome && (
          <>
            <ViewerChrome
              active={v.active}
              total={images.length}
              insetTop={insets.top}
              onClose={onClose}
              onPrev={() => v.goTo(v.active - 1)}
              onNext={() => v.goTo(v.active + 1)}
            />
            <ViewerFilmstrip
              images={images}
              active={v.active}
              insetBottom={insets.bottom}
              onSelect={v.goTo}
            />
          </>
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

function useViewer({
  images,
  initialIndex,
  reduce,
  onClose,
  onIndexChange,
  visible,
}: {
  images: string[];
  initialIndex: number;
  reduce: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
  visible: boolean;
}) {
  const [active, setActive] = React.useState(initialIndex);
  const [chrome, setChrome] = React.useState(true);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sTx = useSharedValue(0);
  const sTy = useSharedValue(0);
  const pagerX = useSharedValue(initialIndex * W);
  const dragY = useSharedValue(0);
  const mode = useSharedValue(0);

  // The viewer stays mounted, so re-sync to the tapped image each time it opens.
  useReopenReset(visible, initialIndex, { setActive, setChrome, scale, savedScale, tx, ty, dragY, pagerX });

  const backdropOpacity = useDerivedValue(() => 1 - clamp(Math.abs(dragY.get()) / H, 0, 1) * 0.85);

  const maxX = () => {
    'worklet';
    return Math.max(0, (W * scale.get() - W) / 2);
  };
  const maxY = () => {
    'worklet';
    return Math.max(0, (H * scale.get() - H) / 2);
  };
  const t = (value: number) => {
    'worklet';
    return withTiming(value, { duration: reduce ? 0 : 220 });
  };

  function commitPage(page: number) {
    scale.set(1);
    savedScale.set(1);
    tx.set(0);
    ty.set(0);
    setActive(page);
    onIndexChange?.(page);
    AccessibilityInfo.announceForAccessibility(`Image ${page + 1} of ${images.length}`);
    ExpoImage.prefetch(
      [images[page + 1], images[page - 1]].filter(Boolean) as string[],
      { cachePolicy: 'memory-disk' },
    );
  }
  function toggleChrome() {
    setChrome(c => !c);
  }
  function goTo(page: number) {
    if (page < 0 || page >= images.length)
      return;
    pagerX.set(t(page * W));
    commitPage(page);
  }

  const gesture = composeGesture({
    scale,
    savedScale,
    tx,
    ty,
    sTx,
    sTy,
    pagerX,
    dragY,
    mode,
    maxX,
    maxY,
    t,
    reduce,
    active,
    count: images.length,
    onClose,
    commitPage,
    toggleChrome,
  });

  const rowStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: -pagerX.get() }, { translateY: dragY.get() }],
  }));
  const imgStyle = useAnimatedStyle(() => ({
    transform: [{ translateX: tx.get() }, { translateY: ty.get() }, { scale: scale.get() }],
  }));
  const bgStyle = useAnimatedStyle(() => ({ opacity: backdropOpacity.get() }));

  return { active, chrome, goTo, gesture, rowStyle, imgStyle, bgStyle };
}

// Reset the pager to `index` on the visible false->true edge. Kept out of
// useViewer so it stays under the line cap; setters pass through `v` so they
// read as a reset, not stray render-time state writes.
function useReopenReset(
  visible: boolean,
  index: number,
  v: {
    setActive: (i: number) => void;
    setChrome: (c: boolean) => void;
    scale: SharedValue<number>;
    savedScale: SharedValue<number>;
    tx: SharedValue<number>;
    ty: SharedValue<number>;
    dragY: SharedValue<number>;
    pagerX: SharedValue<number>;
  },
) {
  const wasVisibleRef = React.useRef(false);
  React.useEffect(() => {
    if (visible && !wasVisibleRef.current) {
      v.setActive(index);
      v.setChrome(true);
      v.scale.set(1);
      v.savedScale.set(1);
      v.tx.set(0);
      v.ty.set(0);
      v.dragY.set(0);
      v.pagerX.set(index * W);
    }
    wasVisibleRef.current = visible;
  }, [visible, index, v]);
}

type GestureCtx = {
  scale: SharedValue<number>;
  savedScale: SharedValue<number>;
  tx: SharedValue<number>;
  ty: SharedValue<number>;
  sTx: SharedValue<number>;
  sTy: SharedValue<number>;
  pagerX: SharedValue<number>;
  dragY: SharedValue<number>;
  mode: SharedValue<number>;
  maxX: () => number;
  maxY: () => number;
  t: (value: number) => number;
  reduce: boolean;
  active: number;
  count: number;
  onClose: () => void;
  commitPage: (page: number) => void;
  toggleChrome: () => void;
};

function composeGesture(c: GestureCtx): ComposedGesture {
  const { scale, savedScale, tx, ty, sTx, sTy, pagerX, dragY, mode, maxX, maxY, t } = c;

  const pinch = Gesture.Pinch()
    .onStart(() => savedScale.set(scale.get()))
    .onUpdate(e => scale.set(clamp(savedScale.get() * e.scale, 1, MAX_SCALE)))
    .onEnd(() => {
      if (scale.get() <= 1) {
        scale.set(t(1));
        tx.set(t(0));
        ty.set(t(0));
        savedScale.set(1);
      }
      else {
        tx.set(clamp(tx.get(), -maxX(), maxX()));
        ty.set(clamp(ty.get(), -maxY(), maxY()));
      }
    });

  const pan = Gesture.Pan()
    .maxPointers(2)
    .averageTouches(true)
    .onStart(() => {
      sTx.set(tx.get());
      sTy.set(ty.get());
      mode.set(0);
    })
    .onUpdate((e) => {
      if (scale.get() > 1) {
        tx.set(clamp(sTx.get() + e.translationX, -maxX(), maxX()));
        ty.set(clamp(sTy.get() + e.translationY, -maxY(), maxY()));
        return;
      }
      if (mode.get() === 0)
        mode.set(Math.abs(e.translationX) > Math.abs(e.translationY) ? 1 : 2);
      if (mode.get() === 1)
        pagerX.set(c.active * W - e.translationX);
      else
        dragY.set(e.translationY);
    })
    .onEnd((e) => {
      if (scale.get() > 1)
        return;
      if (mode.get() === 2) {
        if (Math.abs(dragY.get()) > DISMISS_DISTANCE || Math.abs(e.velocityY) > DISMISS_VELOCITY) {
          dragY.set(withTiming(Math.sign(dragY.get() || 1) * H, { duration: c.reduce ? 0 : 200 }));
          scheduleOnRN(c.onClose);
        }
        else {
          dragY.set(t(0));
        }
      }
      else {
        const page = clamp(Math.round(pagerX.get() / W), 0, c.count - 1);
        pagerX.set(t(page * W));
        if (page !== c.active)
          scheduleOnRN(c.commitPage, page);
      }
    });

  const doubleTap = Gesture.Tap()
    .numberOfTaps(2)
    .maxDuration(250)
    .onEnd((e) => {
      if (scale.get() > 1) {
        scale.set(t(1));
        tx.set(t(0));
        ty.set(t(0));
        savedScale.set(1);
      }
      else {
        savedScale.set(DOUBLE_TAP_SCALE);
        scale.set(t(DOUBLE_TAP_SCALE));
        const fx = (e.x - W / 2) * (DOUBLE_TAP_SCALE - 1);
        const fy = (e.y - H / 2) * (DOUBLE_TAP_SCALE - 1);
        tx.set(t(clamp(-fx, -maxX(), maxX())));
        ty.set(t(clamp(-fy, -maxY(), maxY())));
      }
    });

  const singleTap = Gesture.Tap()
    .numberOfTaps(1)
    .onEnd(() => scheduleOnRN(c.toggleChrome));

  return Gesture.Race(Gesture.Simultaneous(pinch, pan), Gesture.Exclusive(doubleTap, singleTap));
}

function ViewerPager({
  images,
  active,
  gesture,
  rowStyle,
  imgStyle,
  reduce,
}: {
  images: string[];
  active: number;
  gesture: ComposedGesture | GestureType;
  rowStyle: AnimatedStyle<ViewStyle>;
  imgStyle: AnimatedStyle<ViewStyle>;
  reduce: boolean;
}) {
  return (
    <GestureDetector gesture={gesture}>
      <Animated.View style={[{ flexDirection: 'row', width: W * images.length, height: H }, rowStyle]}>
        {images.map((uri, i) => (
          <Animated.View key={uri} style={[styles.page, i === active && imgStyle]}>
            <Image
              source={uri}
              recyclingKey={uri}
              contentFit="contain"
              cachePolicy="memory-disk"
              priority={i === active ? 'high' : 'low'}
              transition={reduce ? 0 : 150}
              allowDownscaling={false}
              style={styles.flex}
              accessible
              accessibilityRole="image"
              accessibilityLabel={`Image ${i + 1} of ${images.length}`}
            />
          </Animated.View>
        ))}
      </Animated.View>
    </GestureDetector>
  );
}

function ViewerChrome({
  active,
  total,
  insetTop,
  onClose,
  onPrev,
  onNext,
}: {
  active: number;
  total: number;
  insetTop: number;
  onClose: () => void;
  onPrev: () => void;
  onNext: () => void;
}) {
  return (
    <>
      <Pressable
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="Close"
        hitSlop={12}
        style={{ top: insetTop + 12 }}
        className="absolute right-3 size-10 items-center justify-center rounded-full bg-black/40"
      >
        <Icon name="x" size={24} color="#fff" />
      </Pressable>

      <View
        pointerEvents="none"
        style={{ top: insetTop + 12 }}
        className="absolute left-1/2 -translate-x-1/2 rounded-full bg-black/40 px-3 py-1"
      >
        <Text variant="footnote" emphasized className="text-white">
          {`${active + 1} / ${total}`}
        </Text>
      </View>

      {total > 1 && (
        <>
          <Pressable
            onPress={onPrev}
            disabled={active === 0}
            accessibilityRole="button"
            accessibilityLabel="Previous image"
            hitSlop={12}
            className="absolute top-1/2 left-3 size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 disabled:opacity-30"
          >
            <Icon name="chevron-left" size={24} color="#fff" />
          </Pressable>
          <Pressable
            onPress={onNext}
            disabled={active === total - 1}
            accessibilityRole="button"
            accessibilityLabel="Next image"
            hitSlop={12}
            className="absolute top-1/2 right-3 size-10 -translate-y-1/2 items-center justify-center rounded-full bg-black/40 disabled:opacity-30"
          >
            <Icon name="chevron-right" size={24} color="#fff" />
          </Pressable>
        </>
      )}
    </>
  );
}

// ponytail: no auto-scroll-to-active — 5-6 thumbs fit on screen; add scrollTo when galleries grow.
function ViewerFilmstrip({
  images,
  active,
  insetBottom,
  onSelect,
}: {
  images: string[];
  active: number;
  insetBottom: number;
  onSelect: (index: number) => void;
}) {
  if (images.length < 2)
    return null;
  return (
    <View
      pointerEvents="box-none"
      style={{ bottom: insetBottom + 12 }}
      className="absolute inset-x-0"
    >
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 8, flexGrow: 1, justifyContent: 'center' }}
      >
        {images.map((uri, i) => (
          <Pressable
            key={uri}
            onPress={() => onSelect(i)}
            accessibilityRole="button"
            accessibilityLabel={`View image ${i + 1} of ${images.length}`}
            className={
              i === active
                ? 'size-12 overflow-hidden rounded-lg border-2 border-gold-500'
                : 'size-12 overflow-hidden rounded-lg border border-white/40'
            }
          >
            <Image source={uri} contentFit="cover" className="size-full" />
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  flex: { flex: 1 },
  black: { backgroundColor: 'black' },
  page: { width: W, height: H, overflow: 'hidden' },
});
