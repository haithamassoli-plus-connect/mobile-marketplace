import { router } from 'expo-router';
import * as React from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  TextInput,
} from 'react-native';
import { SystemBars } from 'react-native-edge-to-edge';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { Image, ScrollView, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { wishlist } from '@/features/home/data';

// GoldenBot — AI Conversation (Figma 448:1502). Reached from the Support sheet's
// "Ask the AI" card. Conversation is seeded per the design; the composer and the
// quick-reply chips append real user bubbles. ponytail: no backend — bot replies
// aren't generated.
type Msg =
  | { id: string; from: 'bot' | 'user'; text: string }
  | { id: string; from: 'bot'; chips: string[] }
  | { id: string; from: 'bot'; product: true };

const SEED: Msg[] = [
  { id: 'm1', from: 'bot', text: 'Hi! I’m GoldenBot, your shopping assistant. I can help with products, orders, returns and more — what would you like to do?' },
  { id: 'm2', from: 'bot', chips: ['Track my order', 'Return an item', 'Product question', 'Talk to a human'] },
  { id: 'm3', from: 'user', text: 'Is the Aviator Shades available in black?' },
  { id: 'm4', from: 'bot', text: 'Yes! The Aviator Shades come in 3 colours. Here’s the black pair:' },
  { id: 'm5', from: 'bot', product: true },
  { id: 'm6', from: 'bot', chips: ['Add to cart', 'See other colours', 'Talk to a human'] },
];

export default function AiChatScreen() {
  const insets = useSafeAreaInsets();
  const scrollRef = React.useRef<any>(null);
  const [messages, setMessages] = React.useState<Msg[]>(SEED);
  const [draft, setDraft] = React.useState('');

  const append = (text: string) => {
    const trimmed = text.trim();
    if (!trimmed) return;
    setMessages(prev => [...prev, { id: `u${prev.length}`, from: 'user', text: trimmed }]);
    requestAnimationFrame(() => scrollRef.current?.scrollToEnd({ animated: true }));
  };

  const send = () => {
    append(draft);
    setDraft('');
  };

  return (
    <View className="flex-1 bg-neutral-50">
      <SystemBars style="dark" />
      {/* Header */}
      <View style={{ paddingTop: insets.top }} className="bg-white shadow-sm">
        <View className="h-14 flex-row items-center gap-2.5 px-2.5">
          <Pressable
            onPress={() => router.back()}
            hitSlop={8}
            accessibilityRole="button"
            accessibilityLabel="back"
            className="size-9 items-center justify-center rounded-2xl active:opacity-70"
          >
            <Icon name="chevron-left" size={24} color="#181d27" />
          </Pressable>

          <View className="size-10">
            <View className="size-10 items-center justify-center rounded-full bg-primary-500">
              <Icon name="bot" size={24} color="#0a0d12" />
            </View>
            <View className="absolute bottom-0 right-0 size-3 rounded-full border-2 border-white bg-success-500" />
          </View>

          <View className="flex-1">
            <View className="flex-row items-center gap-1.5">
              <Text variant="headline" className="text-neutral-900">GoldenBot</Text>
              <View className="rounded-md bg-primary-50 px-1.5 py-px">
                <Text variant="caption-1" className="text-primary-700">AI</Text>
              </View>
            </View>
            <View className="flex-row items-center gap-1.5">
              <View className="size-[7px] rounded-full bg-success-500" />
              <Text variant="caption-1" className="text-neutral-500">AI Assistant · Always online</Text>
            </View>
          </View>
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

          {messages.map(m => (
            <Bubble key={m.id} msg={m} onChip={append} />
          ))}

          {/* Typing */}
          <View className="flex-row items-end gap-2">
            <Avatar />
            <View className="flex-row gap-1 rounded-[16px] rounded-bl-[4px] border border-neutral-200 bg-white px-3.5 py-3">
              {[0, 1, 2].map(d => (
                <View key={d} className="size-1.5 rounded-full bg-neutral-400" />
              ))}
            </View>
          </View>
        </ScrollView>

        {/* Composer */}
        <View
          style={{ paddingBottom: insets.bottom + 8 }}
          className="flex-row items-center gap-2.5 border-t border-neutral-200 bg-white px-3.5 pt-3"
        >
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="add attachment"
            className="size-[38px] items-center justify-center rounded-full bg-neutral-100 active:opacity-70"
          >
            <Icon name="plus" size={22} color="#717680" />
          </Pressable>

          <TextInput
            value={draft}
            onChangeText={setDraft}
            placeholder="Ask GoldenBot…"
            placeholderTextColor="#717680"
            onSubmitEditing={send}
            returnKeyType="send"
            className="flex-1 rounded-[21px] bg-neutral-100 px-4 py-2.5 text-[15px] text-neutral-900"
          />

          <Pressable
            onPress={send}
            accessibilityRole="button"
            accessibilityLabel="send message"
            className="size-[38px] items-center justify-center rounded-full bg-primary-500 active:opacity-80"
          >
            <Icon name="send" size={18} color="#0a0d12" />
          </Pressable>
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

function Avatar() {
  return (
    <View className="size-7 items-center justify-center rounded-[14px] bg-primary-500">
      <Icon name="bot" size={17} color="#0a0d12" />
    </View>
  );
}

function Bubble({ msg, onChip }: { msg: Msg; onChip: (text: string) => void }) {
  if (msg.from === 'user') {
    return (
      <View className="items-end">
        <View className="max-w-[260px] rounded-[18px] rounded-br-[4px] bg-primary-500 px-3.5 py-2.5">
          <Text variant="subheadline" className="text-neutral-950">{msg.text}</Text>
        </View>
      </View>
    );
  }

  if ('chips' in msg) {
    return (
      <View className="flex-row flex-wrap gap-2 pl-9">
        {msg.chips.map((label, i) => (
          <Pressable
            key={label}
            onPress={() => onChip(label)}
            accessibilityRole="button"
            className={`rounded-full border-[1.2px] px-3.5 py-2 active:opacity-70 ${i === msg.chips.length - 1 ? 'border-primary-200 bg-primary-50' : 'border-primary-300 bg-white'}`}
          >
            <Text variant="subheadline" emphasized className="text-primary-800">{label}</Text>
          </Pressable>
        ))}
      </View>
    );
  }

  return (
    <View className="flex-row items-end gap-2">
      <Avatar />
      {'product' in msg ? <ProductCard /> : (
        <View className="max-w-[240px] rounded-[16px] rounded-bl-[4px] border border-neutral-200 bg-white px-3.5 py-2.5">
          <Text variant="subheadline" className="text-neutral-800">{msg.text}</Text>
        </View>
      )}
    </View>
  );
}

function ProductCard() {
  const p = wishlist[1]; // Aviator Shades
  return (
    <View
      className="w-[214px] overflow-hidden rounded-[16px] rounded-bl-[4px] border border-neutral-200 bg-white"
      style={{
        shadowColor: '#0f121a',
        shadowOpacity: 0.05,
        shadowRadius: 8,
        shadowOffset: { width: 0, height: 2 },
        elevation: 1,
      }}
    >
      <Image source={p.image} contentFit="cover" className="h-[124px] w-full bg-neutral-100" />
      <View className="gap-2 px-3 pb-3 pt-[11px]">
        <Text variant="subheadline" emphasized className="text-neutral-900">{p.title}</Text>
        <View className="flex-row items-center gap-2">
          <Text variant="callout" emphasized className="text-primary-700">${p.price}</Text>
          <Text variant="caption-1" className="text-neutral-500">★ 4.8</Text>
          <View className="flex-1" />
          <View className="flex-row items-center gap-1">
            <View className="size-1.5 rounded-full bg-success-500" />
            <Text variant="caption-2" emphasized className="text-success-700">In stock</Text>
          </View>
        </View>
        <Pressable
          onPress={() => router.back()}
          accessibilityRole="button"
          className="items-center rounded-xl bg-primary-500 py-2.5 active:opacity-80"
        >
          <Text variant="subheadline" emphasized className="text-neutral-950">View product</Text>
        </Pressable>
      </View>
    </View>
  );
}
