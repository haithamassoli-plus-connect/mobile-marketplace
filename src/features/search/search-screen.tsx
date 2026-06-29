import { router } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { useState } from 'react';
import { TextInput } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { Chip } from '@/features/home/components/primitives';

import {
  categoryTabs,
  discoveryPills,
  exploreCards,
  exploreTone,
  recentSearches,
  searchPlaceholder,
  trendingSearches,
} from './data';

const ICON_GRAY = '#717680';

export function SearchScreen() {
  const insets = useSafeAreaInsets();

  return (
    <View className="flex-1 bg-neutral-50">
      <StatusBar style="dark" />
      <SearchHeader topInset={insets.top} />
      <View className="h-px bg-neutral-200" />
      <ScrollView
        keyboardShouldPersistTaps="handled"
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: insets.bottom + 28 }}
      >
        <CategoryTabs />
        <FeaturedBanner />
        <ExploreGrid />
        <DiscoveryRail />
        <RecentSearches />
        <TrendingCard />
      </ScrollView>
    </View>
  );
}

function SearchHeader({ topInset }: { topInset: number }) {
  return (
    <View className="bg-white px-4 pb-2.5" style={{ paddingTop: topInset + 8 }}>
      <View className="flex-row items-center gap-2.5">
        <Button
          variant="ghost"
          onPress={() => router.back()}
          accessibilityRole="button"
          accessibilityLabel="go back"
          hitSlop={8}
          className="my-0 size-6 items-center justify-center px-0 active:opacity-60"
        >
          <Icon name="arrow-left" size={24} color="#181d27" />
        </Button>

        <View className="h-[44px] flex-1 flex-row items-center gap-2.5 rounded-xl border border-neutral-200 bg-neutral-100 py-1.5 pr-2 pl-4">
          <Icon name="search" size={18} color={ICON_GRAY} />
          <TextInput
            autoFocus
            placeholder={searchPlaceholder}
            placeholderTextColor={ICON_GRAY}
            returnKeyType="search"
            className="flex-1 font-sans text-[13px] text-neutral-900"
          />
          <View className="flex-row items-center gap-2.5">
            <Icon name="mic" size={20} color={ICON_GRAY} />
            <Icon name="camera" size={20} color={ICON_GRAY} />
          </View>
        </View>
      </View>
    </View>
  );
}

function CategoryTabs() {
  const [active, setActive] = useState('All');
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={{ paddingHorizontal: 16, gap: 8 }}
      className="pt-3.5 pb-2.5"
    >
      {categoryTabs.map(tab => (
        <Button key={tab} variant="ghost" className="my-0 h-auto p-0" onPress={() => setActive(tab)}>
          <Chip label={tab} active={tab === active} />
        </Button>
      ))}
    </ScrollView>
  );
}

function FeaturedBanner() {
  return (
    <View className="px-4 pt-2">
      <View className="flex-row items-center gap-3 rounded-[18px] border border-primary-200 bg-primary-100 p-4">
        <View className="flex-1 gap-1.5">
          <Text variant="caption-2" emphasized className="text-primary-700">LIMITED TIME</Text>
          <Text variant="title-3" emphasized className="text-ink-900">Gift Packages & Bundles</Text>
          <Text variant="caption-1" className="text-neutral-600">Save up to 60% on curated sets</Text>
          <View className="mt-1 flex-row items-center gap-1.5 self-start rounded-full bg-primary-500 py-[7px] pr-2.5 pl-3">
            <Text variant="footnote" emphasized className="text-ink-950">Browse packages</Text>
            <Icon name="arrow-right" size={16} color="#0a0909" />
          </View>
        </View>
        <View className="size-[58px] items-center justify-center rounded-full bg-primary-500">
          <Icon name="gift" size={30} color="#0a0909" />
        </View>
      </View>
    </View>
  );
}

function ExploreGrid() {
  return (
    <View className="gap-3 px-4 pt-3.5">
      {[0, 2, 4].map(start => (
        <View key={start} className="flex-row gap-3">
          {exploreCards.slice(start, start + 2).map((card) => {
            const [bg, border, iconBg, iconColor] = exploreTone[card.tone];
            return (
              <View
                key={card.title}
                className={`h-[120px] flex-1 gap-2.5 rounded-2xl border p-3.5 ${bg} ${border}`}
              >
                <View className={`size-10 items-center justify-center rounded-full ${iconBg}`}>
                  <Icon name={card.icon} size={22} color={iconColor} />
                </View>
                <Text variant="subheadline" emphasized className="text-ink-900">{card.title}</Text>
                <Text variant="caption-1" className="text-neutral-600">{card.subtitle}</Text>
              </View>
            );
          })}
        </View>
      ))}
    </View>
  );
}

function DiscoveryRail() {
  return (
    <>
      <Text variant="title-3" emphasized className="px-4 pt-6 text-ink-900">Search discovery</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 10 }}
        className="pt-3"
      >
        {discoveryPills.map(pill => (
          <View
            key={pill.label}
            className="flex-row items-center gap-2.5 rounded-2xl border border-neutral-200 bg-white py-2 pr-4 pl-2"
          >
            <Image source={pill.image} className="size-10 rounded-[10px]" contentFit="cover" />
            <Text variant="subheadline" className="text-ink-800">{pill.label}</Text>
          </View>
        ))}
      </ScrollView>
    </>
  );
}

function RecentSearches() {
  const [showAll, setShowAll] = useState(false);
  const shown = showAll ? recentSearches : recentSearches.slice(0, 4);
  return (
    <>
      <View className="flex-row items-center justify-between px-4 pt-6">
        <Text variant="title-3" emphasized className="text-ink-900">Recent searches</Text>
        <Button variant="ghost" hitSlop={8} className="my-0 h-auto px-0 active:opacity-60">
          <Text variant="footnote" className="text-neutral-500">Clear all</Text>
        </Button>
      </View>
      <View className="flex-row flex-wrap gap-2 px-4 pt-3">
        {shown.map(term => (
          <View
            key={term}
            className="flex-row items-center gap-[7px] rounded-full border border-neutral-200 bg-neutral-100 py-2 pr-[11px] pl-3"
          >
            <Icon name="clock" size={14} color={ICON_GRAY} />
            <Text variant="footnote" className="text-neutral-700">{term}</Text>
            <Icon name="x" size={13} color={ICON_GRAY} />
          </View>
        ))}
      </View>
      {recentSearches.length > 4
        ? (
            <Button
              variant="ghost"
              onPress={() => setShowAll(v => !v)}
              hitSlop={8}
              className="my-0 h-auto flex-row items-center gap-1 self-start px-4 pt-3 active:opacity-60"
            >
              <Text variant="footnote" emphasized className="text-primary-700">
                {showAll ? 'Show less' : `Show all (${recentSearches.length})`}
              </Text>
              <Icon name={showAll ? 'chevron-up' : 'chevron-down'} size={16} color="#92741a" />
            </Button>
          )
        : null}
    </>
  );
}

function TrendingCard() {
  return (
    <View className="px-4 pt-6">
      <View className="overflow-hidden rounded-[20px] border border-neutral-200 bg-white">
        <View className="flex-row items-center gap-2.5 bg-primary-50 px-4 py-3.5">
          <Icon name="flame" size={22} color="#dbb42c" />
          <Text variant="headline" emphasized className="text-secondary-950">Trending Search</Text>
        </View>
        <View className="px-4 pt-1 pb-2.5">
          {trendingSearches.map((term, i) => (
            <View key={term}>
              {i > 0 ? <View className="h-px bg-neutral-100" /> : null}
              <View className="h-[52px] flex-row items-center gap-3">
                <View
                  className={`size-6 items-center justify-center rounded-sm ${
                    i < 3 ? 'bg-primary-500' : 'bg-neutral-400'
                  }`}
                >
                  <Text variant="caption-2" emphasized className="text-white">{i + 1}</Text>
                </View>
                {i === 0 ? <Icon name="flame" size={16} color="#f04438" /> : null}
                <Text variant="headline" emphasized className="flex-1 text-ink-900">{term}</Text>
              </View>
            </View>
          ))}
        </View>
      </View>
      <Text variant="caption-1" className="pt-2.5 text-neutral-500">
        The Search Trend is daily updated to reflect what shoppers are searching for.
      </Text>
    </View>
  );
}
