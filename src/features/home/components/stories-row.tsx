import { router } from 'expo-router';
import { Button, Image, ScrollView, Text, View } from '@/components/ui';
import { stories } from '@/features/home/data';

export function StoriesRow() {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      className="mt-4"
      contentContainerStyle={{ paddingHorizontal: 16, gap: 14 }}
    >
      {stories.map(story => (
        <View key={story.id} className="w-[72px] items-center">
          <View
            className={`size-16 rounded-full border-2 p-[2px] ${
              story.live ? 'border-gold-500 bg-gold-500' : 'border-neutral-200'
            }`}
          >
            <Image
              source={story.image}
              contentFit="cover"
              className="size-full rounded-full"
            />
            {story.live
              ? (
                  <View className="bg-gold-500 absolute -bottom-1 left-1/2 -translate-x-1/2 rounded-full px-1.5">
                    <Text variant="caption-2" className="font-bold text-white">LIVE</Text>
                  </View>
                )
              : null}
          </View>
          <Button
            onPress={() => router.push(`/live2`)}
          >

            <Text
              numberOfLines={1}
              variant="caption-1"
              className="text-ink-800 mt-1.5 text-center"
            >
              {story.label}
            </Text>
          </Button>
        </View>
      ))}
    </ScrollView>
  );
}
