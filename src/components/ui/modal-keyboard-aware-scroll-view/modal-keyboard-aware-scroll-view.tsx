import type { BottomSheetScrollViewMethods } from '@gorhom/bottom-sheet';
import type { BottomSheetScrollViewProps } from '@gorhom/bottom-sheet/src/components/bottomSheetScrollable/types';
import type { ComponentType } from 'react';
import type { KeyboardAwareScrollViewProps } from 'react-native-keyboard-controller';
import {

  createBottomSheetScrollableComponent,
  SCROLLABLE_TYPE,
} from '@gorhom/bottom-sheet';
import { memo } from 'react';
import { KeyboardAwareScrollView } from 'react-native-keyboard-controller';
import Reanimated from 'react-native-reanimated';

const AnimatedScrollView
  = Reanimated.createAnimatedComponent(
    KeyboardAwareScrollView as unknown as ComponentType<KeyboardAwareScrollViewProps>,
  );
const BottomSheetScrollViewComponent = createBottomSheetScrollableComponent<
  BottomSheetScrollViewMethods,
  BottomSheetScrollViewProps
>(SCROLLABLE_TYPE.SCROLLVIEW, AnimatedScrollView);
const BottomSheetKeyboardAwareScrollView = memo(BottomSheetScrollViewComponent);

BottomSheetKeyboardAwareScrollView.displayName
  = 'BottomSheetKeyboardAwareScrollView';

export default BottomSheetKeyboardAwareScrollView as (
  props: BottomSheetScrollViewProps & KeyboardAwareScrollViewProps,
) => ReturnType<typeof BottomSheetKeyboardAwareScrollView>;
