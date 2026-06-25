import type { BottomSheetModal } from '@gorhom/bottom-sheet';
import type { IconName } from './icon';
import {
  BottomSheetView,
  BottomSheetModal as Sheet,
} from '@gorhom/bottom-sheet';
import { router } from 'expo-router';
import * as React from 'react';
import { Pressable } from 'react-native';

import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Text, useModal, View } from '@/components/ui';

import { renderBackdrop } from '@/components/ui/modal';
import { Icon } from './icon';

// Help & Support sheet (Figma 416:1544). Reuses the base modal's backdrop +
// useModal; sizes to its content so no snapPoint guessing is needed.
// ponytail: cards just dismiss for now — wire onPress to real routes/chat when
// those screens exist.
type Option = {
  icon: IconName;
  iconBg: string; // icon tile background
  iconColor: string;
  title: string;
  badge: { label: string; bg: string; color: string; dot?: boolean };
  body: string;
  team?: boolean; // Live Chat only — avatar stack + reply-time footer
  route?: Parameters<typeof router.push>[0]; // navigate on press, else just dismiss
};

const SUCCESS = '#027a48'; // success-700
const PRIMARY = '#92741a'; // primary-700
const INFO = '#175cd3'; // information-700
const CHEVRON = '#a4a7ae'; // neutral-400

const OPTIONS: Option[] = [
  {
    icon: 'messages-square',
    iconBg: 'bg-success-100',
    iconColor: SUCCESS,
    title: 'Live Chat',
    badge: { label: 'Online', bg: 'bg-success-50', color: 'text-success-700', dot: true },
    body: 'Talk to a real person — contact our support workers about orders, payments and delivery.',
    team: true,
    route: '/live-chat',
  },
  {
    icon: 'bot',
    iconBg: 'bg-primary-100',
    iconColor: PRIMARY,
    title: 'Ask the AI',
    badge: { label: '24/7 • INSTANT', bg: 'bg-primary-50', color: 'text-primary-700' },
    body: 'Get instant answers — ask a question about a product, track an order, or check our return policy.',
    route: '/ai-chat',
  },
  {
    icon: 'ticket',
    iconBg: 'bg-information-100',
    iconColor: INFO,
    title: 'Submit a Ticket',
    badge: { label: 'REPLY IN ~24H', bg: 'bg-information-50', color: 'text-information-700' },
    body: 'Can’t find an answer? Send us the details and we’ll email you back within 24 hours.',
  },
];

const TEAM = [
  { initial: 'K', bg: 'bg-information-400' },
  { initial: 'M', bg: 'bg-primary-400' },
  { initial: 'R', bg: 'bg-success-400' },
];

export function SupportModal({ ref }: { ref?: React.Ref<BottomSheetModal> }) {
  const insets = useSafeAreaInsets();
  const modal = useModal();
  React.useImperativeHandle(ref, () => modal.ref.current as BottomSheetModal);

  return (
    <Sheet
      ref={modal.ref}
      backdropComponent={renderBackdrop}
      handleComponent={Handle}
      backgroundStyle={{ borderTopLeftRadius: 28, borderTopRightRadius: 28 }}
    >
      <BottomSheetView
        style={{ paddingBottom: insets.bottom + 30 }}
        className="gap-4 px-5 pt-2.5"
      >
        {/* Header */}
        <View className="flex-row items-center justify-between">
          <Text variant="title-3" emphasized className="text-neutral-900">
            Help & Support
          </Text>
          <Pressable
            onPress={modal.dismiss}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="close support"
            className="size-8 items-center justify-center rounded-2xl bg-neutral-100"
          >
            <Icon name="x" size={16} color="#717680" />
          </Pressable>
        </View>

        {/* Hero */}
        <View className="flex-row items-center gap-3.5 rounded-[22px] border border-primary-200 bg-primary-50 p-4">
          <View className="size-[84px] items-center justify-center rounded-full border border-primary-200 bg-primary-100">
            <Icon name="headphones" size={36} color="#b8941f" />
          </View>
          <View className="flex-1 gap-1.5">
            <Text variant="caption-2" emphasized className="text-primary-700">
              WE'RE HERE FOR YOU
            </Text>
            <Text variant="title-3" emphasized className="text-neutral-900">
              How can we help?
            </Text>
            <Text variant="footnote" className="text-neutral-600">
              Choose how you’d like to reach us — we usually reply in minutes.
            </Text>
            <View className="mt-0.5 flex-row items-center gap-1.5 self-start rounded-full bg-success-50 py-1 pr-2.5 pl-2">
              <View className="size-2 rounded-full bg-success-500" />
              <Text variant="caption-1" emphasized className="text-success-700">
                Support is online now
              </Text>
            </View>
          </View>
        </View>

        {/* Options */}
        <View className="gap-3">
          {OPTIONS.map(o => (
            <Card
              key={o.title}
              option={o}
              onPress={() => {
                modal.dismiss();
                if (o.route)
                  router.push(o.route);
              }}
            />
          ))}
        </View>

        {/* Footer */}
        <View className="items-center gap-3 pt-1">
          <View className="h-px w-full bg-neutral-200" />
          <View className="flex-row items-center gap-1.5">
            <Icon name="shield-check" size={14} color="#717680" />
            <Text variant="caption-1" className="text-neutral-500">
              Your conversations are private & secure
            </Text>
          </View>
          <View className="flex-row items-center gap-2.5">
            <Text variant="footnote" emphasized className="text-neutral-700">
              Privacy Policy
            </Text>
            <View className="size-[3px] rounded-full bg-neutral-300" />
            <Text variant="footnote" emphasized className="text-neutral-700">
              Terms & Conditions
            </Text>
          </View>
        </View>
      </BottomSheetView>
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

function Card({ option: o, onPress }: { option: Option; onPress: () => void }) {
  return (
    <Pressable
      onPress={onPress}
      accessibilityRole="button"
      className="flex-row items-center gap-3.5 rounded-[18px] border border-neutral-200 bg-white p-3.5 active:opacity-80"
      style={{
        shadowColor: '#0f121a',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <View className={`size-12 items-center justify-center rounded-[14px] ${o.iconBg}`}>
        <Icon name={o.icon} size={24} color={o.iconColor} />
      </View>

      <View className="flex-1 gap-[5px]">
        <View className="flex-row items-center gap-2">
          <Text variant="headline" className="text-neutral-900">
            {o.title}
          </Text>
          <View className={`flex-row items-center gap-1 rounded-full px-2 py-[3px] ${o.badge.bg}`}>
            {o.badge.dot && <View className="size-1.5 rounded-full bg-success-500" />}
            <Text variant="caption-2" emphasized className={o.badge.color}>
              {o.badge.label}
            </Text>
          </View>
        </View>

        <Text variant="footnote" className="text-neutral-600">
          {o.body}
        </Text>

        {o.team && (
          <View className="flex-row items-center gap-2 pt-0.5">
            <View className="flex-row">
              {TEAM.map((m, i) => (
                <View
                  key={m.initial}
                  className={`size-[26px] items-center justify-center rounded-full border-[1.5px] border-white ${m.bg} ${i > 0 ? '-ml-2' : ''}`}
                >
                  <Text variant="caption-2" emphasized className="text-white">
                    {m.initial}
                  </Text>
                </View>
              ))}
            </View>
            <Text variant="caption-1" emphasized className="text-success-700">
              Our team • avg. 2 min reply
            </Text>
          </View>
        )}
      </View>

      <Icon name="chevron-right" size={20} color={CHEVRON} />
    </Pressable>
  );
}
