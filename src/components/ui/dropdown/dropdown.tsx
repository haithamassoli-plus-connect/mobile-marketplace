import type { SvgProps } from 'react-native-svg';
import * as React from 'react';
import { Pressable, View } from 'react-native';
import Svg, { Path } from 'react-native-svg';

import { Text } from '../text';

const MUTED = '#717680';
const GOLD = '#dbb42c';

export type DropdownOption = { label: string; value: string | number };

type DropdownProps = {
  options: DropdownOption[];
  value?: string | number;
  onChange: (value: string | number) => void;
  placeholder?: string;
  testID?: string;
};

/**
 * Inline expand/collapse dropdown — opens a list in place (no nested bottom
 * sheet), so it is safe to use inside another bottom sheet. Controlled via
 * `value` + `onChange`. For a full-screen picker, use `Select` instead.
 */
export function Dropdown({
  options,
  value,
  onChange,
  placeholder = 'Select',
  testID,
}: DropdownProps) {
  const [open, setOpen] = React.useState(false);
  const selected = options.find(o => o.value === value);

  return (
    <View>
      <Pressable
        onPress={() => setOpen(o => !o)}
        accessibilityRole="button"
        accessibilityState={{ expanded: open }}
        testID={testID ? `${testID}-trigger` : undefined}
        className="flex-row items-center justify-between rounded-[10px] border border-neutral-300 bg-white px-3.5 py-3"
      >
        <Text variant="subheadline" className="text-neutral-900">
          {selected?.label ?? placeholder}
        </Text>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Chevron />
        </View>
      </Pressable>

      {open && (
        <View className="mt-1.5 overflow-hidden rounded-[10px] border border-neutral-200">
          {options.map((option) => {
            const isSelected = option.value === value;
            return (
              <Pressable
                key={option.value}
                onPress={() => {
                  onChange(option.value);
                  setOpen(false);
                }}
                accessibilityRole="radio"
                accessibilityState={{ selected: isSelected }}
                testID={testID ? `${testID}-item-${option.value}` : undefined}
                className={`flex-row items-center justify-between px-3.5 py-3 ${
                  isSelected ? 'bg-primary-50' : 'bg-white'
                }`}
              >
                <Text
                  variant="subheadline"
                  className={isSelected ? 'text-primary-700' : 'text-neutral-700'}
                >
                  {option.label}
                </Text>
                {isSelected && <Check />}
              </Pressable>
            );
          })}
        </View>
      )}
    </View>
  );
}

function Chevron(props: SvgProps) {
  return (
    <Svg width={20} height={20} fill="none" viewBox="0 0 20 20" {...props}>
      <Path
        d="m5 7.5 5 5 5-5"
        stroke={MUTED}
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}

function Check(props: SvgProps) {
  return (
    <Svg width={18} height={18} fill="none" viewBox="0 0 24 24" {...props}>
      <Path
        d="m20 6.5-10.5 10.5L4 11.75"
        stroke={GOLD}
        strokeWidth={2.2}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
