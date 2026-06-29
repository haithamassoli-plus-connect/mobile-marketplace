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

import { Image, Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

// ponytail: Dimensions.get('window') once at module scope — the viewer is fullscreen and
// short-lived; a rotation re-seed isn't worth a useWindowDimensions subscription.
const { width: W, height: H } = Dimensions.get('window');
const MAX_SCALE = 4;
const DOUBLE_TAP_SCALE = 2.5;
const DISMISS_DISTANCE = H * 0.2;
const DISMISS_VELOCITY = 800;

// React 19: no forwardRef, no ref prop. Controlled component. Product-agnostic (string URIs only).
export type ImageViewerProps = {
  /** Image URIs to page through. */
  images: string[];
  /** Controlled visibility (standard Modal pattern; NOT a behavior-variant boolean). */
  visible: boolean;
  /** Page shown when the viewer opens. Default 0. */
  initialIndex?: number;
  /** Called when the user closes via the X button or swipe-to-dismiss. */
  onClose: () => void;
  /**
   * Optional: fires after a pager snap settles with the new page index.
   * Lets a consumer (e.g. Gallery) keep its own dots/thumbnails in sync.
   */
  onIndexChange?: (index: number) => void;
};

// ponytail: NO compound sub-components — a fullscreen lightbox is one atomic gesture surface.
// Splitting it into <Viewer.Backdrop>/<Viewer.Pager>/<Viewer.CloseButton> would push the shared
// gesture SharedValues through context for zero consumer benefit. Flat controlled API wins here.
// (Internal helpers below — the hook + leaf components — exist only to satisfy max-lines-per-function;
// they are not part of the public surface.)
export function ImageViewer({
  images,
  visible,
  initialIndex = 0,
  onClose,
  onIndexChange,
}: ImageViewerProps): React.JSX.Element {
  const insets = useSafeAreaInsets();
  const reduce = useReducedMotion();
  const v = useViewer({ images, initialIndex, reduce, onClose, onIndexChange });

  return (
    <Modal
      visible={visible}
      transparent
      statusBarTranslucent
      animationType="fade"
      onRequestClose={onClose}
    >
      {/* REQUIRED own root: the GestureHandlerRootView in _layout.tsx doesn't cover the Modal's
          separate native hierarchy, so without this gestures silently no-op. */}
      <GestureHandlerRootView style={styles.flex}>
        <StatusBar style="light" />
        {/* accessibilityViewIsModal traps the screen reader so it can't wander behind the scrim. */}
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
          <ViewerChrome
            active={v.active}
            total={images.length}
            insetTop={insets.top}
            onClose={onClose}
            onPrev={() => v.goTo(v.active - 1)}
            onNext={() => v.goTo(v.active + 1)}
          />
        )}
      </GestureHandlerRootView>
    </Modal>
  );
}

// All gesture state + the composed gesture graph + animated styles. Lives in a hook so the
// public component stays small; semantically still "inside the component". Every SharedValue
// mutation below is in a gesture worklet, a useDerivedValue, or a plain JS function dispatched
// via scheduleOnRN — never in useEffect/useCallback/useMemo (immutability lint).
function useViewer({
  images,
  initialIndex,
  reduce,
  onClose,
  onIndexChange,
}: {
  images: string[];
  initialIndex: number;
  reduce: boolean;
  onClose: () => void;
  onIndexChange?: (index: number) => void;
}) {
  // React state (NOT SharedValues): drives which page receives the zoom transform + the dots/announce.
  const [active, setActive] = React.useState(initialIndex);
  const [chrome, setChrome] = React.useState(true);

  const scale = useSharedValue(1);
  const savedScale = useSharedValue(1);
  const tx = useSharedValue(0);
  const ty = useSharedValue(0);
  const sTx = useSharedValue(0);
  const sTy = useSharedValue(0);
  // ponytail: pager offset is seeded AT CONSTRUCTION from initialIndex — no useEffect re-seed. If a
  // consumer needs a different start between opens, key <ImageViewer> on initialIndex to remount.
  const pagerX = useSharedValue(initialIndex * W);
  const dragY = useSharedValue(0);
  const mode = useSharedValue(0); // per-pan axis lock: 0 undecided / 1 paging / 2 dismiss

  const backdropOpacity = useDerivedValue(() => 1 - clamp(Math.abs(dragY.get()) / H, 0, 1) * 0.85);

  // ponytail: pan bounds use the scaled VIEWPORT box (W,H), not the true letterboxed displayed-image
  // rect (we lack intrinsic image dimensions). At high zoom this allows a small over-pan into the
  // letterbox margin — acceptable for a product gallery.
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

  // JS-thread callbacks (plain functions; invoked via scheduleOnRN from worklets — a SharedValue
  // .set() from here is legal, it's not inside useEffect/useCallback/useMemo).
  function commitPage(page: number) {
    // ponytail: zoom reset lives here (one place), not in a useEffect watching active.
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
  // Accessible alternative to the swipe pager (chevron buttons). Plain JS function: pagerX.set here
  // is the same legal site as commitPage's resets.
  function goTo(page: number) {
    if (page < 0 || page >= images.length)
      return;
    pagerX.set(t(page * W));
    commitPage(page);
  }

  // Gestures: built inline each render (NOT useMemo — React Compiler memoizes; a manual memo closing
  // over SharedValues would trip the immutability lint). Extracted to a plain function only to keep
  // each function under max-lines-per-function; it owns no hooks.
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

// Composes pinch (zoom) + pan (zoomed-pan / paging / swipe-to-dismiss via a per-pan axis lock) +
// double-tap (anchored zoom toward the tap) + single-tap (toggle chrome). Pure function, no hooks.
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

  // Anchors zoom toward the tap point so it doesn't jump to center.
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

// Reanimated translateX row (NOT ScrollView/FlashList — a native scroll recognizer would fight the
// Pinch/Pan composition). ponytail: render ALL pages; product galleries have a handful of images and
// expo-image handles decode/cache. Only the active page gets imgStyle so zoom never leaks to neighbors.
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

// Close button + index counter + (when >1 image) prev/next chevrons. Toggled by the single-tap.
// Close is a real focusable button, never gesture-only.
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

const styles = StyleSheet.create({
  flex: { flex: 1 },
  black: { backgroundColor: 'black' },
  page: { width: W, height: H, overflow: 'hidden' },
});
