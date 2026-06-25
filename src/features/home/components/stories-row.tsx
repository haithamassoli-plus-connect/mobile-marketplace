import { router } from 'expo-router';
import { Image, Pressable, ScrollView, Text, View } from '@/components/ui';
import { stories } from '@/features/home/data';

// ponytail: Figma renders the LIVE pill in error-red; SPEC says gold, so we follow the spec.
export function StoriesRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 12 }}
    >
      {stories.map(story => (
        <Pressable
          key={story.id}
          onPress={() => router.push('/live2')}
          className="w-20 items-center gap-1.5"
        >
          <View className="size-[76px] items-center justify-center">
            <View
              className={`size-[72px] items-center justify-center rounded-full border-2 ${
                story.live ? 'border-gold-500' : 'border-neutral-200'
              }`}
            >
              <Image
                source={story.image}
                contentFit="cover"
                className="size-[62px] rounded-full"
              />
            </View>
            {story.live
              ? (
                  <View className="absolute -bottom-[3px] flex-row items-center gap-1 rounded-full bg-gold-500 px-2 py-[3px]">
                    <View className="size-[5px] rounded-full bg-ink-900" />
                    <Text
                      variant="caption-2"
                      emphasized
                      className="text-ink-900"
                    >
                      LIVE
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
        </Pressable>
      ))}
    </ScrollView>
  );
}
