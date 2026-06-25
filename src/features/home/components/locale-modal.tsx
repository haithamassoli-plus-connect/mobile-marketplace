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

// Region & Language sheet (Figma 157:3891 Language / 156:3891 Currency). Same
// shell as Support/Wishlist; two segmented tabs share one searchable list.
// ponytail: selection is local state — call i18n changeLanguage (src/lib/i18n)
// and a currency store here once those ship.
const GOLD = '#b8941f'; // primary check + active chip text
const MUTED = '#717680'; // neutral-500

type Item = { code: string; chip: string; title: string; sub: string; rtl?: boolean };
type Tab = 'currency' | 'language';

const LANGUAGES: Item[] = [
  { code: 'en', chip: 'EN', title: 'English', sub: 'English' },
  { code: 'ar', chip: 'AR', title: 'العربية', sub: 'Arabic', rtl: true },
  { code: 'fr', chip: 'FR', title: 'Français', sub: 'French' },
  { code: 'tr', chip: 'TR', title: 'Türkçe', sub: 'Turkish' },
  { code: 'es', chip: 'ES', title: 'Español', sub: 'Spanish' },
  { code: 'de', chip: 'DE', title: 'Deutsch', sub: 'German' },
  { code: 'ur', chip: 'UR', title: 'اردو', sub: 'Urdu', rtl: true },
  { code: 'ru', chip: 'RU', title: 'Русский', sub: 'Russian' },
];

const CURRENCIES: Item[] = [
  { code: 'JOD', chip: 'JD', title: 'Jordanian Dinar', sub: 'JOD' },
  { code: 'USD', chip: '$', title: 'US Dollar', sub: 'USD' },
  { code: 'EUR', chip: '€', title: 'Euro', sub: 'EUR' },
  { code: 'GBP', chip: '£', title: 'British Pound', sub: 'GBP' },
  { code: 'SAR', chip: 'SR', title: 'Saudi Riyal', sub: 'SAR' },
  { code: 'AED', chip: 'AED', title: 'UAE Dirham', sub: 'AED' },
  { code: 'EGP', chip: 'E£', title: 'Egyptian Pound', sub: 'EGP' },
  { code: 'TRY', chip: '₺', title: 'Turkish Lira', sub: 'TRY' },
];

const CONFIG = {
  language: {
    data: LANGUAGES,
    placeholder: 'Search Language',
    subtitle: 'The app interface will be shown in your selected language.',
  },
  currency: {
    data: CURRENCIES,
    placeholder: 'Search For Currency',
    subtitle: 'Prices across the app will be shown in your selected currency.',
  },
} as const;

export function LocaleModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  const [tab, setTab] = React.useState<Tab>('language');
  const [selected, setSelected] = React.useState({ language: 'en', currency: 'JOD' });
  const [query, setQuery] = React.useState('');

  const { data, placeholder, subtitle } = CONFIG[tab];
  const q = query.trim().toLowerCase();
  const items = q
    ? data.filter(i => `${i.title} ${i.sub}`.toLowerCase().includes(q))
    : data;

  const switchTab = (next: Tab) => {
    setTab(next);
    setQuery('');
  };

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

        {/* Segmented tabs */}
        <View className="px-5">
          <View className="flex-row gap-1 rounded-xl bg-neutral-100 p-1">
            <Segment label="Currency" active={tab === 'currency'} onPress={() => switchTab('currency')} />
            <Segment label="Language" active={tab === 'language'} onPress={() => switchTab('language')} />
          </View>
        </View>

        {/* Search */}
        <View className="mt-3 px-5">
          <View className="h-11 flex-row items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-100 pr-2 pl-4">
            <Icon name="search" size={18} color={MUTED} />
            <BottomSheetTextInput
              value={query}
              onChangeText={setQuery}
              placeholder={placeholder}
              placeholderTextColor={MUTED}
              className="flex-1 text-[13px] text-neutral-900"
              style={{ paddingVertical: 0 }}
            />
            <Icon name="mic" size={22} color={MUTED} />
          </View>
        </View>

        {/* Subtitle */}
        <Text variant="footnote" className="px-5 pt-3.5 pb-1.5 text-neutral-500">
          {subtitle}
        </Text>

        {/* List */}
        <View className="px-5">
          {items.map((item, i) => (
            <Row
              key={item.code}
              item={item}
              selected={item.code === selected[tab]}
              divider={i < items.length - 1}
              onPress={() => setSelected(s => ({ ...s, [tab]: item.code }))}
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

function Segment({ label, active, onPress }: { label: string; active: boolean; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="tab"
      accessibilityState={{ selected: active }}
      className={`flex-1 items-center justify-center rounded-[9px] py-2 ${active ? 'bg-white' : ''}`}
      style={
        active
          ? {
              shadowColor: '#000',
              shadowOpacity: 0.1,
              shadowRadius: 3,
              shadowOffset: { width: 0, height: 1 },
              elevation: 1,
            }
          : undefined
      }
    >
      <Text
        variant="subheadline"
        emphasized
        className={active ? 'text-neutral-900' : 'text-neutral-500'}
      >
        {label}
      </Text>
    </Pressable>
  );
}

function Row({
  item,
  selected,
  divider,
  onPress,
}: {
  item: Item;
  selected: boolean;
  divider: boolean;
  onPress: () => void;
}) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="radio"
      accessibilityState={{ selected }}
      accessibilityLabel={`${item.title}, ${item.sub}`}
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
            {item.chip}
          </Text>
        </View>

        <View className="flex-1">
          <Text
            variant="callout"
            className="text-neutral-900"
            style={item.rtl ? { writingDirection: 'rtl' } : undefined}
          >
            {item.title}
          </Text>
          <Text variant="footnote" className="text-neutral-500">
            {item.sub}
          </Text>
        </View>

        {selected && <Icon name="check" size={22} color={GOLD} />}
      </View>

      {divider && <View className="ml-[52px] h-px bg-neutral-200" />}
    </Pressable>
  );
}
