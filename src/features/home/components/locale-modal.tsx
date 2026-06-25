import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import {
  BottomSheetScrollView,
  BottomSheetTextInput,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import * as React from 'react';
import { Pressable } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Text, useModal, View } from '@/components/ui';
import { renderBackdrop } from '@/components/ui/modal';
import { Icon } from './icon';

// Region & Language sheet (Figma 157:3891). Same shell as Support/Wishlist —
// shared backdrop, drag handle, close. Search filters the list locally.
// ponytail: selection is local state — call i18n changeLanguage (src/lib/i18n)
// here once more than en/ar ship. Currency tab is a placeholder; no design yet.
const GOLD = '#b8941f'; // primary check + active chip text
const MUTED = '#717680'; // neutral-500

type Lang = { code: string; chip: string; native: string; name: string; rtl?: boolean };
const LANGUAGES: Lang[] = [
  { code: 'en', chip: 'EN', native: 'English', name: 'English' },
  { code: 'ar', chip: 'AR', native: 'العربية', name: 'Arabic', rtl: true },
  { code: 'fr', chip: 'FR', native: 'Français', name: 'French' },
  { code: 'tr', chip: 'TR', native: 'Türkçe', name: 'Turkish' },
  { code: 'es', chip: 'ES', native: 'Español', name: 'Spanish' },
  { code: 'de', chip: 'DE', native: 'Deutsch', name: 'German' },
  { code: 'ur', chip: 'UR', native: 'اردو', name: 'Urdu', rtl: true },
  { code: 'ru', chip: 'RU', native: 'Русский', name: 'Russian' },
];

export function LocaleModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  const [selected, setSelected] = React.useState('en');
  const [query, setQuery] = React.useState('');
  const q = query.trim().toLowerCase();
  const items = q
    ? LANGUAGES.filter(l => `${l.native} ${l.name}`.toLowerCase().includes(q))
    : LANGUAGES;

  return (
    <Sheet
      ref={modal.ref}
      snapPoints={['85%']}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 24, borderTopRightRadius: 24 }}
    >
      <BottomSheetScrollView
        contentContainerStyle={{ paddingBottom: insets.bottom + 20 }}
        showsVerticalScrollIndicator={false}
      >
        {/* Header */}
        <View className="flex-row items-center justify-between px-5 pb-3.5">
          <Text variant="title-3" emphasized className="text-neutral-900">
            Region & Language
          </Text>
          <Pressable
            onPress={modal.dismiss}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="close region and language"
            className="size-[30px] items-center justify-center rounded-[15px] bg-neutral-100"
          >
            <Icon name="x" size={14} color={MUTED} />
          </Pressable>
        </View>

        {/* Segmented tabs — only Language is designed/active for now */}
        <View className="px-5">
          <View className="flex-row gap-1 rounded-xl bg-neutral-100 p-1">
            <View className="flex-1 items-center justify-center rounded-[9px] py-2">
              <Text variant="subheadline" emphasized className="text-neutral-500">
                Currency
              </Text>
            </View>
            <View
              className="flex-1 items-center justify-center rounded-[9px] bg-white py-2"
              style={{
                shadowColor: '#000',
                shadowOpacity: 0.1,
                shadowRadius: 3,
                shadowOffset: { width: 0, height: 1 },
                elevation: 1,
              }}
            >
              <Text variant="subheadline" emphasized className="text-neutral-900">
                Language
              </Text>
            </View>
          </View>
        </View>

        {/* Search */}
        <View className="mt-3 px-5">
          <View className="h-11 flex-row items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-100 pr-2 pl-4">
            <Icon name="search" size={18} color={MUTED} />
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder="Search Language"
              placeholderTextColor={MUTED}
              className="flex-1 text-[13px] text-neutral-900"
              style={{ paddingVertical: 0 }}
            />
            <Icon name="mic" size={22} color={MUTED} />
          </View>
        </View>

        {/* Subtitle */}
        <Text variant="footnote" className="px-5 pt-3.5 pb-1.5 text-neutral-500">
          The app interface will be shown in your selected language.
        </Text>

        {/* Language list */}
        <View className="px-5">
          {items.map((l, i) => (
            <Row
              key={l.code}
              lang={l}
              selected={l.code === selected}
              divider={i < items.length - 1}
              onPress={() => setSelected(l.code)}
            />
          ))}
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

function Row({
  lang: l,
  selected,
  divider,
  onPress,
}: {
  lang: Lang;
  selected: boolean;
  divider: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${l.name}, ${l.native}`}
      className="active:opacity-70"
    >
      <View className="flex-row items-center gap-3.5 py-3">
        <View
          className={`size-[38px] items-center justify-center rounded-full ${
            selected ? 'bg-primary-50' : 'bg-neutral-100'
          }`}
        >
          <Text
            variant="footnote"
            emphasized
            className={selected ? 'text-primary-700' : 'text-neutral-700'}
          >
            {l.chip}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            variant="callout"
            className="text-neutral-900"
            style={l.rtl ? { writingDirection: 'rtl' } : undefined}
          >
            {l.native}
          </Text>
          <Text variant="footnote" className="text-neutral-500">
            {l.name}
          </Text>
        </View>

        {selected && <Icon name="check" size={22} color={GOLD} />}
      </View>

      {divider && <View className="ml-[52px] h-px bg-neutral-200" />}
    </Pressable>
  );
}
