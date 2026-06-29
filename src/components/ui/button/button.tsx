import type { GestureResponderEvent, PressableProps, View } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import * as Haptics from 'expo-haptics';
import * as React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import Animated, { useAnimatedStyle, useSharedValue, withSpring } from 'react-native-reanimated';
import { tv } from 'tailwind-variants';

import { FONT_CLASS } from '../font';

const AnimatedPressable = Animated.createAnimatedComponent(Pressable);
const PRESS_SCALE = 0.96;
const SPRING_CONFIG = { damping: 15, stiffness: 400, mass: 0.5 };

const button = tv({
  slots: {
    container: 'my-2 flex flex-row items-center justify-center rounded-md px-4',
    label: `${FONT_CLASS} text-[16px] leading-[21px] font-semibold`,
    indicator: 'h-6 text-white',
  },

  variants: {
    variant: {
      default: {
        container: 'bg-black dark:bg-white',
        label: 'text-white dark:text-black',
        indicator: 'text-white dark:text-black',
      },
      secondary: {
        container: 'bg-primary-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      outline: {
        container: 'border border-neutral-400',
        label: 'text-black dark:text-neutral-100',
        indicator: 'text-black dark:text-neutral-100',
      },
      destructive: {
        container: 'bg-red-600',
        label: 'text-white',
        indicator: 'text-white',
      },
      ghost: {
        container: 'bg-transparent',
        label: 'text-black underline dark:text-white',
        indicator: 'text-black dark:text-white',
      },
      link: {
        container: 'bg-transparent',
        label: 'text-black',
        indicator: 'text-black',
      },
    },
    size: {
      default: {
        container: 'h-10',
        label: 'text-[16px] leading-[21px]',
      },
      lg: {
        container: 'h-12 px-8',
        label: 'text-[20px] leading-[25px]',
      },
      sm: {
        container: 'h-8 px-3',
        label: 'text-[13px] leading-[18px]',
        indicator: 'h-2',
      },
      icon: { container: 'size-9' },
    },
    disabled: {
      true: {
        container: 'bg-neutral-300 dark:bg-neutral-300',
        label: 'text-neutral-600 dark:text-neutral-600',
        indicator: 'text-neutral-400 dark:text-neutral-400',
      },
    },
    fullWidth: {
      false: {
        container: 'self-center',
      },
    },
  },
  defaultVariants: {
    variant: 'default',
    disabled: false,
    fullWidth: true,
    size: 'default',
  },
});

type ButtonVariants = VariantProps<typeof button>;
type Props = {
  label?: string;
  loading?: boolean;
  className?: string;
  textClassName?: string;
  /** Spring a subtle scale-down on press. */
  animated?: boolean;
  /** Fire haptic feedback on press-down. `true` = Light impact, or pass a specific style. */
  haptic?: boolean | Haptics.ImpactFeedbackStyle;
} & ButtonVariants & Omit<PressableProps, 'disabled'>;

export function Button({ ref, label: text, loading = false, variant = 'default', disabled = false, size = 'default', className = '', testID, textClassName = '', animated = true, haptic = true, style, onPressIn, onPressOut, ...props }: Props & { ref?: React.RefObject<View | null> }) {
  const styles = React.useMemo(
    () => button({ variant, disabled, size }),
    [variant, disabled, size],
  );

  const scale = useSharedValue(1);
  const pressStyle = useAnimatedStyle(() => ({ transform: [{ scale: scale.get() }] }));

  function handlePressIn(e: GestureResponderEvent) {
    if (animated)
      scale.set(withSpring(PRESS_SCALE, SPRING_CONFIG));
    if (haptic)
      // ponytail: swallow rejection on web/unsupported devices.
      void Haptics.impactAsync(haptic === true ? Haptics.ImpactFeedbackStyle.Light : haptic).catch(() => {});
    onPressIn?.(e);
  }
  function handlePressOut(e: GestureResponderEvent) {
    if (animated)
      scale.set(withSpring(1, SPRING_CONFIG));
    onPressOut?.(e);
  }

  // ponytail: `any` dodges the AnimatedPressable|Pressable union prop-type clash; both take PressableProps.
  const Comp: React.ComponentType<any> = animated ? AnimatedPressable : Pressable;

  return (
    <Comp
      disabled={disabled || loading}
      className={styles.container({ className })}
      onPressIn={handlePressIn}
      onPressOut={handlePressOut}
      style={animated ? [pressStyle, style] : style}
      {...props}
      ref={ref}
      testID={testID}
    >
      {props.children
        ? (
            props.children
          )
        : (
            <>
              {loading
                ? (
                    <ActivityIndicator
                      size="small"
                      className={styles.indicator()}
                      testID={testID ? `${testID}-activity-indicator` : undefined}
                    />
                  )
                : (
                    <Text
                      testID={testID ? `${testID}-label` : undefined}
                      className={styles.label({ className: textClassName })}
                    >
                      {text}
                    </Text>
                  )}
            </>
          )}
    </Comp>
  );
}
