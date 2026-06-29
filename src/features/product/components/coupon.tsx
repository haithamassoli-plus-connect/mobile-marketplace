import type { Coupon as CouponType } from '../data';
import { useState } from 'react';
import { TextInput } from 'react-native';

import { Button, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const CHECK = '#12b76a';

type CardClasses = {
  card: string;
  pct: string;
  off: string;
  cap: string;
  use: string;
  pill: string;
  code: string;
};

const VARIANTS: Record<CouponType['variant'], CardClasses> = {
  gold: {
    card: 'bg-gold-50 border border-dashed border-gold-300',
    pct: 'text-gold-800',
    off: 'text-gold-600',
    cap: 'text-neutral-600',
    use: 'text-neutral-600',
    pill: 'border-gold-800',
    code: 'text-gold-800',
  },
  green: {
    card: 'bg-success-600',
    pct: 'text-white',
    off: 'text-success-100',
    cap: 'text-success-100',
    use: 'text-success-100',
    pill: 'border-white',
    code: 'text-white',
  },
  blue: {
    card: 'bg-white border border-neutral-200',
    pct: 'text-information-600',
    off: 'text-information-500',
    cap: 'text-neutral-600',
    use: 'text-neutral-600',
    pill: 'border-information-700',
    code: 'text-information-700',
  },
  red: {
    card: 'bg-error-50 border border-error-200',
    pct: 'text-error-600',
    off: 'text-error-500',
    cap: 'text-neutral-600',
    use: 'text-neutral-600',
    pill: 'border-error-700',
    code: 'text-error-700',
  },
  dark: {
    card: 'bg-secondary-800',
    pct: 'text-gold-400',
    off: 'text-white',
    cap: 'text-secondary-200',
    use: 'text-secondary-200',
    pill: 'border-gold-400',
    code: 'text-gold-400',
  },
};

export function Coupon({ coupons }: { coupons: CouponType[] }) {
  const [code, setCode] = useState('');
  const [applied, setApplied] = useState(false);
  return (
    <View className="gap-3 pt-3.5 pb-4">
      <View className="flex-row items-center justify-between px-4">
        <Text variant="headline" emphasized className="text-neutral-900">Coupons for you</Text>
        <Button variant="ghost" className="my-0 h-auto p-0">
          <Text variant="caption-1" className="font-medium text-neutral-500">View all</Text>
        </Button>
      </View>

      <View className="flex-row items-center gap-2.5 px-4">
        <View className="h-[46px] flex-1 flex-row items-center rounded-[10px] border border-neutral-200 bg-neutral-100 px-[14px]">
          <TextInput
            value={code}
            onChangeText={(text) => {
              setCode(text);
              setApplied(false);
            }}
            placeholder="Enter coupon code"
            placeholderTextColor="#a4a7ae"
            autoCapitalize="characters"
            className="flex-1 font-sans text-[14px] text-neutral-900"
          />
          {applied ? <Icon name="check" size={16} color={CHECK} /> : null}
        </View>
        <Button
          variant="ghost"
          onPress={() => setApplied(code.length > 0)}
          className={`my-0 h-[46px] items-center justify-center rounded-[10px] px-[22px] ${applied ? 'bg-success-500' : 'bg-gold-500'}`}
        >
          <Text variant="subheadline" emphasized className={applied ? 'text-white' : 'text-neutral-900'}>
            {applied ? 'Applied' : 'Apply'}
          </Text>
        </Button>
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
      >
        {coupons.map(item => (
          <CouponCard
            key={item.id}
            coupon={item}
            onApply={() => {
              setCode(item.code);
              setApplied(true);
            }}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function CouponCard({ coupon, onApply }: { coupon: CouponType; onApply: () => void }) {
  const v = VARIANTS[coupon.variant];
  return (
    <Button
      variant="ghost"
      onPress={onApply}
      className={`relative my-0 h-[116px] w-[244px] flex-row items-center justify-start gap-3 overflow-hidden rounded-[14px] py-4 pr-3.5 pl-4 ${v.card}`}
    >
      {coupon.variant === 'blue'
        ? (
            <View className="absolute top-0 left-0 h-full w-1 rounded-l-[14px] bg-information-500" />
          )
        : null}
      {coupon.variant === 'red'
        ? (
            <View className="absolute top-0 left-0 h-1.5 w-full rounded-t-[14px] bg-error-500" />
          )
        : null}

      <View className="flex-1 justify-center gap-1">
        <View className="flex-row items-baseline gap-1">
          <Text className={`text-[30px] leading-none font-bold ${v.pct}`}>
            {coupon.percent}
            %
          </Text>
          <Text variant="footnote" emphasized className={v.off}>OFF</Text>
        </View>
        <Text variant="caption-1" className={`font-medium ${v.cap}`}>{coupon.caption}</Text>
      </View>

      <View className="items-end justify-center gap-1.5">
        <Text className={`text-[9px] font-bold tracking-[0.5px] ${v.use}`}>USE CODE</Text>
        <View className={`rounded-md border border-dashed px-2 py-1 ${v.pill}`}>
          <Text className={`text-[12px] font-bold tracking-[0.3px] ${v.code}`}>{coupon.code}</Text>
        </View>
      </View>
    </Button>
  );
}
