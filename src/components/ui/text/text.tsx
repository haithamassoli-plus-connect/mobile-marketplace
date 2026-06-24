/* eslint-disable better-tailwindcss/no-unknown-classes */
import type { TextProps, TextStyle } from 'react-native';
import type { VariantProps } from 'tailwind-variants';
import type { TxKeyPath } from '@/lib/i18n';
import * as React from 'react';
import { I18nManager, Text as NNText, StyleSheet } from 'react-native';
import { tv } from 'tailwind-variants';

import { translate } from '@/lib/i18n';

// iOS HIG type scale (Noto Sans) — size/line-height baked in per variant.
// `emphasized` bumps each style to its Figma "Emphasized" weight.
const text = tv({
  base: 'font-sans text-black dark:text-white',
  variants: {
    variant: {
      'large-title': 'text-[34px] leading-[41px] font-normal',
      'title-1': 'text-[28px] leading-[34px] font-normal',
      'title-2': 'text-[22px] leading-[28px] font-normal',
      'title-3': 'text-[20px] leading-[25px] font-normal',
      'headline': 'text-[17px] leading-[22px] font-semibold',
      'body': 'text-[17px] leading-[22px] font-normal',
      'callout': 'text-[16px] leading-[21px] font-normal',
      'subheadline': 'text-[15px] leading-[20px] font-normal',
      'footnote': 'text-[13px] leading-[18px] font-normal',
      'caption-1': 'text-[12px] leading-[16px] font-normal',
      'caption-2': 'text-[11px] leading-[13px] font-normal',
    },
    emphasized: { true: '' },
  },
  compoundVariants: [
    { variant: 'large-title', emphasized: true, class: 'font-bold' },
    { variant: 'title-1', emphasized: true, class: 'font-bold' },
    { variant: 'title-2', emphasized: true, class: 'font-bold' },
    { variant: 'title-3', emphasized: true, class: 'font-semibold' },
    { variant: 'body', emphasized: true, class: 'font-semibold' },
    { variant: 'callout', emphasized: true, class: 'font-semibold' },
    { variant: 'subheadline', emphasized: true, class: 'font-semibold' },
    { variant: 'footnote', emphasized: true, class: 'font-semibold' },
    { variant: 'caption-1', emphasized: true, class: 'font-medium' },
    { variant: 'caption-2', emphasized: true, class: 'font-semibold' },
    // headline is semibold-only — no emphasized pair.
  ],
  defaultVariants: { variant: 'body' },
});

type Props = {
  className?: string;
  tx?: TxKeyPath;
} & VariantProps<typeof text> & TextProps;

export function Text({
  className = '',
  style,
  tx,
  variant,
  emphasized,
  children,
  ...props
}: Props) {
  const textStyle = React.useMemo(
    () => text({ variant, emphasized, className }),
    [variant, emphasized, className],
  );

  const nStyle = React.useMemo(
    () =>
      StyleSheet.flatten([
        {
          writingDirection: I18nManager.isRTL ? 'rtl' : 'ltr',
        },
        style,
      ]) as TextStyle,
    [style],
  );
  return (
    <NNText className={textStyle} style={nStyle} {...props}>
      {tx ? translate(tx) : children}
    </NNText>
  );
}
