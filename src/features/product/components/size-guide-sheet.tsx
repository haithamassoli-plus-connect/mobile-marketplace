import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { SizeGuide } from '../data';
import {
  BottomSheetScrollView,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Dropdown, Text, useModal, View } from '@/components/ui';
import { renderBackdrop } from '@/components/ui/modal';
import { Icon } from '@/features/home/components/icon';

const MUTED = '#717680';

const toInch = (cm: number) => Math.round(cm / 2.54);

export function SizeGuideSheet({
  ref,
  guide,
  title,
}: {
  ref?: React.Ref<BottomSheetModal>;
  guide: SizeGuide;
  title: string;
}) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  const [systemIndex, setSystemIndex] = React.useState(0);
  const [unit, setUnit] = React.useState<'cm' | 'in'>('cm');

  const system = guide.systems[systemIndex];

  return (
    <Sheet
      ref={modal.ref}
      snapPoints={['90%']}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      <BottomSheetScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
      >
        <View className="gap-[18px] px-5 pt-1">
          <Header title={title} onClose={modal.dismiss} />

          <View className="gap-1.5">
            <Text variant="caption-2" emphasized className="tracking-[0.6px] text-neutral-500">
              SIZE SYSTEM
            </Text>
            <Dropdown
              testID="size-system"
              value={systemIndex}
              onChange={v => setSystemIndex(Number(v))}
              options={guide.systems.map((s, i) => ({ label: s.label, value: i }))}
            />
          </View>

          <Chart guide={guide} system={system} unit={unit} onUnit={setUnit} />

          <View className="gap-2">
            <Text variant="footnote" emphasized className="text-neutral-900">
              How to measure
            </Text>
            {guide.howToMeasure.map(t => (
              <View key={t} className="flex-row items-start gap-2">
                <View className="mt-[7px] size-[5px] rounded-full bg-neutral-300" />
                <View className="flex-1">
                  <Text variant="caption-1" className="text-neutral-600">
                    {t}
                  </Text>
                </View>
              </View>
            ))}
          </View>

          {guide.fitNote && (
            <View className="flex-row items-center gap-2 rounded-[10px] bg-primary-50 p-3">
              <View className="size-1.5 rounded-full bg-primary-500" />
              <Text variant="caption-1" className="flex-1 text-primary-800">
                {guide.fitNote}
              </Text>
            </View>
          )}

          <Button
            variant="ghost"
            onPress={modal.dismiss}
            className="my-0 h-auto w-full items-center justify-center rounded-xl bg-primary-500 px-0 py-3.5"
          >
            <Text variant="subheadline" emphasized className="text-neutral-900">
              Got it
            </Text>
          </Button>
        </View>
      </BottomSheetScrollView>
    </Sheet>
  );
}

function Handle() {
  return (
    <View className="items-center pt-2.5 pb-1">
      <View className="h-[5px] w-10 rounded-full bg-neutral-300" />
    </View>
  );
}

function Header({ title, onClose }: { title: string; onClose: () => void }) {
  return (
    <View className="flex-row items-center justify-between">
      <View className="gap-0.5">
        <Text variant="title-3" emphasized className="text-neutral-900">
          Size Guide
        </Text>
        <Text variant="footnote" className="text-neutral-500">
          {title}
        </Text>
      </View>
      <Button
        variant="ghost"
        onPress={onClose}
        accessibilityRole="button"
        accessibilityLabel="close size guide"
        className="my-0 size-[34px] h-auto items-center justify-center rounded-full bg-neutral-100 px-0"
      >
        <Icon name="x" size={18} color={MUTED} />
      </Button>
    </View>
  );
}

function Chart({
  guide,
  system,
  unit,
  onUnit,
}: {
  guide: SizeGuide;
  system: SizeGuide['systems'][number];
  unit: 'cm' | 'in';
  onUnit: (u: 'cm' | 'in') => void;
}) {
  return (
    <>
      <View className="flex-row items-center justify-between">
        <Text variant="subheadline" emphasized className="text-neutral-900">
          Size chart
        </Text>
        <View className="flex-row gap-0.5 rounded-lg bg-neutral-100 p-0.5">
          <Segment label="cm" active={unit === 'cm'} onPress={() => onUnit('cm')} />
          <Segment label="in" active={unit === 'in'} onPress={() => onUnit('in')} />
        </View>
      </View>

      <View className="overflow-hidden rounded-xl border border-neutral-200">
        <View className="flex-row bg-neutral-100 px-3.5 py-2.5">
          <Text variant="caption-1" emphasized className="w-[64px] text-neutral-600">
            SIZE
          </Text>
          {guide.columns.map(c => (
            <Text
              key={c}
              variant="caption-1"
              emphasized
              className="flex-1 text-center text-neutral-600"
            >
              {c.toUpperCase()}
            </Text>
          ))}
        </View>
        {guide.rows.map((row, i) => (
          <View
            key={system.sizes[i]}
            className={`flex-row items-center px-3.5 py-2.5 ${
              i % 2 === 0 ? 'bg-white' : 'bg-neutral-50'
            }`}
          >
            <Text variant="footnote" emphasized className="w-[64px] text-neutral-900">
              {system.sizes[i]}
            </Text>
            {row.map((v, j) => (
              <Text
                key={guide.columns[j]}
                variant="footnote"
                className="flex-1 text-center text-neutral-700"
              >
                {unit === 'in' ? toInch(v) : v}
              </Text>
            ))}
          </View>
        ))}
      </View>
    </>
  );
}

function Segment({
  label,
  active,
  onPress,
}: {
  label: string;
  active: boolean;
  onPress: () => void;
}) {
  return (
    <Button
      variant="ghost"
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={`my-0 h-auto rounded-md px-3 py-1 ${active ? 'bg-primary-500' : ''}`}
    >
      <Text
        variant="caption-1"
        emphasized
        className={active ? 'text-neutral-900' : 'text-neutral-500'}
      >
        {label.toUpperCase()}
      </Text>
    </Button>
  );
}
