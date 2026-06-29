import { router } from 'expo-router';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  TextInput,
} from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Button, Image, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { wishlist } from '@/features/home/data';

type Msg
  = | { id: string; from: 'agent' | 'user'; text: string }
    | { id: string; from: 'agent'; order: true };

const SEED: Msg[] = [
  { id: 'm1', from: 'agent', text: 'Hi there! Thanks for reaching out to Golden Place. How can I help you today?' },
  { id: 'm2', from: 'user', text: 'Hi! My order #GP-48213 hasn’t shipped yet. Can you check?' },
  { id: 'm3', from: 'agent', text: 'Of course — let me pull that up for you.' },
  { id: 'm4', from: 'agent', order: true },
  { id: 'm5', from: 'agent', text: 'Good news: it’s packed and ships today. You’ll get tracking by 6 PM.' },
  { id: 'm6', from: 'user', text: 'Perfect, thank you so much!' },
];

export default function LiveChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<any>(null);
  const [messages, setMessages] = React.useState<Msg[]>(SEED);
  const [draft, setDraft] = React.useState('');

  const send = () => {
    const text = draft.trim();
    if (!text)
      return;
    setMessages(prev => [...prev, { id: `u${prev.length}`, from: 'user', text }]);
    setDraft('');
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <SystemBars style="dark" />
      <View
        style={{ paddingTop: insets.top }}
        className="bg-white shadow-sm"
      >
        <View className="h-14 flex-row items-center gap-2.5 px-2.5">
          <Button
            variant="ghost"
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="back"
            className="my-0 h-auto px-0 size-9 items-center justify-center rounded-2xl active:opacity-70"
          >
            <Icon name="chevron-left" size={24} color="#181d27" />
          </Button>

          <View className="size-10">
            <View className="size-10 items-center justify-center rounded-full bg-success-400">
              <Text variant="headline" className="text-white">L</Text>
            </View>
            <View className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-success-500" />
          </View>

          <View className="flex-1">
            <Text variant="headline" className="text-neutral-900">Layla Hassan</Text>
            <View className="flex-row items-center gap-1.5">
              <View className="size-[7px] rounded-full bg-success-500" />
              <Text variant="caption-1" className="text-neutral-500">Support Agent · Online</Text>
            </View>
          </View>

          <Button
            variant="ghost"
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="call agent"
            className="my-0 h-auto px-0 size-10 items-center justify-center rounded-full bg-neutral-50 active:opacity-70"
          >
            <Icon name="phone" size={20} color="#181d27" />
          </Button>
        </View>
      </View>

      <KeyboardAvoidingView
        className="flex-1"
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        keyboardVerticalOffset={insets.top + 56}
      >
        <ScrollView
          ref={scrollRef}
          className="flex-1"
          contentContainerStyle={{ padding: 16, gap: 10 }}
          onContentSizeChange={() => scrollRef.current?.scrollToEnd({ animated: false })}
        >
          <Divider>Today 9:41 AM</Divider>
          <Pill>You’re connected with Layla · avg. reply 2 min</Pill>

          {messages.map((m, i) => (
            <Bubble
              key={m.id}
              msg={m}
              avatar={m.from === 'agent' && messages[i + 1]?.from !== 'agent'}
            />
          ))}

          <View className="flex-row items-end gap-2">
            <Avatar />
            <View className="flex-row gap-1 rounded-[18px] rounded-bl-[4px] border border-neutral-200 bg-white px-3.5 py-3">
              {[0, 1, 2].map(d => (
                <View key={d} className="size-1.5 rounded-full bg-neutral-400" />
              ))}
            </View>
          </View>
        </ScrollView>

        <View
          style={{ paddingBottom: insets.bottom + 8 }}
          className="flex-row items-center gap-2.5 border-t border-neutral-200 bg-white px-3.5 pt-3"
        >
          <Button
            variant="ghost"
            accessibilityRole="button"
            accessibilityLabel="add attachment"
            className="my-0 h-auto px-0 size-[38px] items-center justify-center rounded-full bg-neutral-100 active:opacity-70"
          >
            <Icon name="plus" size={22} color="#717680" />
          </Button>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Message Layla…"
            placeholderTextColor="#717680"
            onSubmitEditing={send}
            returnKeyType="send"
            className="flex-1 rounded-[21px] bg-neutral-100 px-4 py-2.5 text-[15px] text-neutral-900"
          />

          <Button
            variant="ghost"
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="send message"
            className="my-0 h-auto px-0 size-[38px] items-center justify-center rounded-full bg-primary-500 active:opacity-80"
          >
            <Icon name="send" size={18} color="#0a0d12" />
          </Button>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
}

function Divider({ children }: { children: string }) {
  return (
    <Text variant="caption-2" className="text-center text-neutral-400">{children}</Text>
  );
}

function Pill({ children }: { children: string }) {
  return (
    <View className="self-center rounded-full bg-neutral-100 px-3 py-1.5">
      <Text variant="caption-2" className="text-neutral-500">{children}</Text>
    </View>
  );
}

function Avatar() {
  return (
    <View className="size-7 items-center justify-center rounded-[14px] bg-success-400">
      <Text variant="caption-2" emphasized className="text-white">L</Text>
    </View>
  );
}

function Bubble({ msg, avatar }: { msg: Msg; avatar: boolean }) {
  if (msg.from === 'user') {
    return (
      <View className="items-end">
        <View className="max-w-[260px] rounded-[18px] rounded-br-[4px] bg-primary-500 px-3.5 py-2.5">
          <Text variant="subheadline" className="text-neutral-950">{msg.text}</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2">
      {avatar ? <Avatar /> : <View className="w-7" />}
      {'order' in msg
        ? <OrderCard />
        : (
            <View className="max-w-[260px] rounded-[18px] rounded-bl-[4px] border border-neutral-200 bg-white px-3.5 py-2.5">
              <Text variant="subheadline" className="text-neutral-800">{msg.text}</Text>
            </View>
          )}
    </View>
  );
}

function OrderCard() {
  return (
    <View className="flex-row items-center gap-2.5 rounded-2xl rounded-bl-[4px] border border-neutral-200 bg-white p-2.5">
      <Image
        source={wishlist[0].image}
        contentFit="cover"
        className="size-[54px] rounded-[10px] bg-neutral-100"
      />
      <View className="gap-[3px]">
        <Text variant="caption-1" emphasized className="text-neutral-900">Order #GP-48213</Text>
        <Text variant="caption-1" className="text-neutral-500">Heritage Watch · Qty 1</Text>
        <View className="flex-row items-center gap-1.5 self-start rounded-full bg-success-50 py-[3px] pl-2 pr-2.5">
          <View className="size-1.5 rounded-full bg-success-500" />
          <Text variant="caption-2" emphasized className="text-success-700">Packed · ships today</Text>
        </View>
      </View>
    </View>
  );
}
