import { Stack, useLocalSearchParams } from 'expo-router';
import * as React from 'react';

import {
  ActivityIndicator,
  FocusAwareStatusBar,
  Text,
  View,
} from '@/components/ui';
import { usePost } from './api';

export function PostDetailScreen() {
  const local = useLocalSearchParams<{ id: string }>();

  const { data, isPending, isError } = usePost({
    variables: { id: local.id },
  });

  let content: React.ReactNode;
  if (isPending) {
    content = (
      <View className="flex-1 justify-center p-3">
        <ActivityIndicator />
      </View>
    );
  }
  else if (isError) {
    content = (
      <View className="flex-1 justify-center p-3">
        <Text className="text-center">Error loading post</Text>
      </View>
    );
  }
  else {
    content = (
      <View className="flex-1 p-3">
        <Text className="text-xl">{data.title}</Text>
        <Text>
          {data.body}
          {' '}
        </Text>
      </View>
    );
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Post', headerBackTitle: 'Feed' }} />
      <FocusAwareStatusBar />
      {content}
    </>
  );
}
