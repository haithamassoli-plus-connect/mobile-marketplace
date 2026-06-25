import { Image, Pressable, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';
import { live } from '@/features/home/data';

// ponytail: dummy live-stream comments — the data module has no comments field.
const comments = [
  { id: 'c1', user: 'Sneha', text: 'Love this bag!', starred: true, opacity: 'opacity-60' },
  { id: 'c2', user: 'Ankit', text: 'Is it available in black?', opacity: 'opacity-80' },
  { id: 'c3', user: 'Pooja', text: 'Amazing quality!', starred: true, opacity: 'opacity-90' },
  { id: 'c4', user: 'Kavya', text: 'What is the material?' },
];

const actions = [
  { id: 'products', icon: 'shopping-bag' as const, label: 'Products' },
  { id: 'lives', icon: 'radio' as const, label: 'Lives' },
  { id: 'share', icon: 'share-2' as const, label: 'Share' },
];

export function LiveVideo() {
  return (
    // ponytail: rounded-3xl == Figma radius/24; aspect mirrors the 361x722 node.
    <View className="relative mx-4 mt-8 aspect-361/722 overflow-hidden rounded-3xl">
      {/* Live stream cover */}
      <Image
        source={live.image}
        contentFit="cover"
        className="absolute inset-0 size-full"
      />
      {/* Bottom scrim for legibility */}
      <View className="absolute inset-x-0 bottom-0 h-[330px] bg-black/30" />
      <View className="absolute inset-x-0 bottom-0 h-40 bg-black/55" />

      {/* Top-left: LIVE badge + viewers + host */}
      <View className="absolute top-4 left-2 gap-2">
        <View className="flex-row items-center gap-1.5 self-start rounded-lg bg-error-500 py-[5px] pr-2.5 pl-2">
          <View className="size-[7px] rounded-full bg-white" />
          <Text variant="caption-2" emphasized className="text-white">{live.badge}</Text>
        </View>
        <View className="flex-row items-center gap-2 self-start rounded-xl bg-black/40 p-1">
          <Image
            source={live.products[0].image}
            contentFit="cover"
            className="size-7 rounded-full"
          />
          <Text variant="footnote" emphasized className="pr-1 text-white">{live.host}</Text>
        </View>
        <View className="flex-row items-center gap-1.5 self-start rounded-xl bg-black/40 py-1 pr-2.5 pl-2">
          <Icon name="eye" size={12} color="#ffffff" />
          <Text variant="caption-2" className="text-white/90">{live.viewers}</Text>
        </View>
      </View>

      {/* Top-right: mute */}
      <Pressable className="absolute top-[18px] right-3 size-9 items-center justify-center rounded-full bg-black/50">
        <Icon name="volume-x" size={18} color="#ffffff" />
      </Pressable>

      {/* Right action sidebar */}
      <View className="absolute right-3 bottom-[200px] items-center gap-[18px]">
        {actions.map(a => (
          <Pressable key={a.id} className="items-center gap-1.5">
            <View className="size-12 items-center justify-center rounded-full bg-black/50">
              <Icon name={a.icon} size={22} color="#ffffff" />
            </View>
            <Text variant="caption-2" emphasized className="text-white/95">{a.label}</Text>
          </Pressable>
        ))}
      </View>

      {/* Title over the stream */}
      <View className="absolute inset-x-4 bottom-[210px]">
        <Text variant="title-3" emphasized className="text-white" numberOfLines={2}>
          {live.title}
        </Text>
      </View>

      {/* Mini product strip */}
      <View className="absolute inset-x-3 bottom-[148px] flex-row gap-2">
        {live.products.map(product => (
          <Pressable
            key={product.id}
            className="flex-1 flex-row items-center gap-1.5 rounded-xl bg-white/90 p-1"
          >
            <Image
              source={product.image}
              contentFit="cover"
              className="size-8 rounded-lg"
            />
            <View className="flex-1">
              <Text variant="caption-2" emphasized className="text-ink-800" numberOfLines={1}>
                {product.title}
              </Text>
              <Text variant="caption-2" emphasized className="text-gold-600">
                {`$ ${product.price}`}
              </Text>
            </View>
          </Pressable>
        ))}
      </View>

      {/* Live comments */}
      <View className="absolute bottom-[72px] left-4 gap-1.5">
        {comments.map(c => (
          <View
            key={c.id}
            className={`flex-row items-center gap-1.5 self-start rounded-2xl bg-black/35 py-1.5 pr-3 pl-2.5 ${c.opacity ?? ''}`}
          >
            <Text variant="caption-1" emphasized className="text-gold-500">{c.user}</Text>
            {c.starred ? <Icon name="star" size={11} color="#dbb42c" /> : null}
            <Text variant="footnote" className="text-white/95">{c.text}</Text>
          </View>
        ))}
      </View>

      {/* Comment input */}
      <View className="absolute inset-x-4 bottom-4 flex-row items-center gap-2.5">
        <View className="flex-1 rounded-full border border-white/25 bg-white/15 px-4 py-3">
          <Text variant="footnote" className="text-white/80">Say something…</Text>
        </View>
        <Pressable className="size-[46px] items-center justify-center rounded-full bg-gold-500">
          <Icon name="send" size={20} color="#0a0d12" />
        </Pressable>
      </View>
    </View>
  );
}
