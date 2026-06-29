import type { StoryTag } from '@/features/home/data';
import { router } from 'expo-router';
import { Button, Image, ScrollView, Text, View } from '@/components/ui';
import { stories } from '@/features/home/data';

const badge: Record<StoryTag, { label: string; bg: string; text: string; dot?: boolean }> = {
  live: { label: 'LIVE', bg: 'bg-error-500', text: 'text-white', dot: true },
  new: { label: 'NEW', bg: 'bg-ink-900', text: 'text-white' },
  hot: { label: 'HOT', bg: 'bg-gold-500', text: 'text-ink-900' },
};

export function StoriesRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
    >
      {stories.map((story) => {
        const tag = story.tag ? badge[story.tag] : null;
        return (
          <Button
            key={story.id}
            variant="ghost"
            onPress={() => router.push({ pathname: '/story', params: { id: story.id } })}
            className="my-0 h-auto px-0 rounded-none flex-col w-20 items-center gap-1.5"
          >
            <View className="size-[76px] items-center justify-center">
              <View
                className={`size-[72px] items-center justify-center rounded-full border-2 ${
                  story.viewed ? 'border-neutral-200' : 'border-gold-500'
                }`}
              >
                <Image
                  source={story.image}
                  contentFit="cover"
                  className="size-[62px] rounded-full"
                />
              </View>
              {tag
                ? (
                    <View
                      className={`absolute -bottom-[3px] flex-row items-center gap-1 rounded-full px-2 py-[3px] ${tag.bg}`}
                    >
                      {tag.dot
                        ? <View className="size-[5px] rounded-full bg-white" />
                        : null}
                      <Text variant="caption-2" emphasized className={tag.text}>
                        {tag.label}
                      </Text>
                    </View>
                  )
                : null}
            </View>
            <Text
              numberOfLines={1}
              variant="caption-1"
              emphasized
              className="text-center text-neutral-700"
            >
              {story.label}
            </Text>
          </Button>
        );
      })}
    </ScrollView>
  );
}
