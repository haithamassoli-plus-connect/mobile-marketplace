import { useState } from 'react';
import { TextInput } from 'react-native';

import { Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const INK_900 = '#181d27'; // neutral-900
const GOLD_800 = '#785e1a';
const NEUTRAL_400 = '#a4a7ae';

// B6 — coupon entry + a promo callout. The field is real; "Apply" is decorative.
export function Coupon() {
  const [code, setCode] = useState('');
  return (
    <View className="px-4 py-1.5">
      <View className="gap-3 rounded-2xl border border-neutral-200 p-[14px]">
        <View className="flex-row items-center gap-2">
          <Icon name="ticket-percent" size={18} color={INK_900} />
          <Text variant="subheadline" emphasized className="text-neutral-900">Apply Coupon</Text>
        </View>

        <View className="flex-row items-center gap-2">
          <TextInput
            value={code}
            onChangeText={setCode}
            placeholder="Enter coupon code"
            placeholderTextColor={NEUTRAL_400}
            autoCapitalize="characters"
            className="h-11 flex-1 rounded-[10px] border border-neutral-200 bg-neutral-100 px-[14px] font-sans text-[13px] text-neutral-900"
          />
          {/* ponytail: decorative — no validation/redemption yet. */}
          <Pressable className="h-11 items-center justify-center rounded-[10px] bg-gold-500 px-[18px]">
            <Text variant="footnote" emphasized className="text-neutral-1000">Apply</Text>
          </Pressable>
        </View>

        <View className="flex-row items-center justify-between rounded-xl border-[1.5px] border-gold-200 bg-gold-50 px-[14px] py-3">
          <View className="flex-1 gap-1">
            <Text variant="title-3" emphasized className="text-gold-700">10% OFF</Text>
            <Text variant="caption-1" className="text-neutral-600">Valid on your first order</Text>
          </View>
          <View className="flex-row items-center gap-1.5 rounded-lg border-[1.5px] border-gold-300 bg-white px-2.5 py-2">
            <Text variant="footnote" emphasized className="text-gold-800">WELCOME10</Text>
            <Icon name="copy" size={14} color={GOLD_800} />
          </View>
        </View>
      </View>
    </View>
  );
}
