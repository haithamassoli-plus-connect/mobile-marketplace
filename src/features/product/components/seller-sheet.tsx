import type { SellerProfile } from '../data';
import { Fragment } from 'react';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const BLUE = '#2e90fa';
const GOLD = '#dbb42c';
const GREEN = '#027a48';
const INK_900 = '#181d27';
const INK_800 = '#252b37';
const WHITE = '#ffffff';

export function SellerSheet({ seller }: { seller: SellerProfile }) {
  const insets = useSafeAreaInsets();
  return (
    <View className="gap-[18px] px-5 pt-1" style={{ paddingBottom: insets.bottom + 20 }}>
      {seller.topRated
        ? (
            <View className="flex-row items-center gap-1.5 self-start rounded-full bg-success-50 py-[5px] pr-[11px] pl-[9px]">
              <Icon name="star" size={14} color={GREEN} />
              <Text variant="footnote" emphasized className="text-success-700">Top Rated Seller</Text>
            </View>
          )
        : null}

      <View className="flex-row items-center justify-between">
        <View className="flex-row items-center gap-3">
          <Image source={seller.avatar} contentFit="cover" className="size-[52px] rounded-full" />
          <View className="gap-1">
            <View className="flex-row items-center gap-1.5">
              <Text variant="headline" emphasized className="text-neutral-900">{seller.name}</Text>
              {seller.verified ? <Icon name="badge-check" size={16} color={BLUE} /> : null}
            </View>
            <View className="flex-row items-center gap-1.5">
              <Icon name="star" size={15} color={GOLD} />
              <Text variant="subheadline" emphasized className="text-neutral-900">{seller.rating.toFixed(1)}</Text>
              <Text variant="footnote" className="text-neutral-500">{`(${seller.ratingCount})`}</Text>
            </View>
          </View>
        </View>
        <Button variant="ghost" className="my-0 h-auto flex-row items-center gap-0.5 rounded-full border-[1.5px] border-neutral-300 py-[9px] pr-3 pl-4">
          <Text variant="subheadline" emphasized className="text-neutral-900">Visit</Text>
          <Icon name="chevron-right" size={18} color={INK_900} />
        </Button>
      </View>

      <View className="flex-row items-center rounded-2xl bg-neutral-50 py-4">
        {seller.stats.map((stat, i) => (
          <Fragment key={stat.label}>
            {i > 0 ? <View className="h-[34px] w-px bg-neutral-200" /> : null}
            <View className="flex-1 items-center gap-[3px]">
              <Text variant="headline" emphasized className="text-neutral-900">{stat.value}</Text>
              <Text variant="caption-1" className="text-neutral-500">{stat.label}</Text>
            </View>
          </Fragment>
        ))}
      </View>

      <View className="flex-row items-center gap-3">
        <Button variant="ghost" className="my-0 px-0 h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-full border-[1.5px] border-neutral-300">
          <Icon name="tag" size={20} color={INK_800} />
          <Text variant="callout" emphasized className="text-neutral-800">Request Deal</Text>
        </Button>
        <Button variant="ghost" className="my-0 px-0 h-[50px] flex-1 flex-row items-center justify-center gap-2 rounded-full bg-gold-600">
          <Icon name="message-circle" size={20} color={WHITE} />
          <Text variant="callout" emphasized className="text-white">Chat with Seller</Text>
        </Button>
      </View>
    </View>
  );
}
