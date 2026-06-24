import { useRouter } from 'expo-router';
import * as React from 'react';

import {
  Button,
  FocusAwareStatusBar,
  SafeAreaView,
  Text,
  View,
} from '@/components/ui';
import { useIsFirstTime } from '@/lib/hooks';
import { Cover } from './components/cover';

export function OnboardingScreen() {
  const [_, setIsFirstTime] = useIsFirstTime();
  const router = useRouter();
  return (
    <View className="flex h-full items-center justify-center">
      <FocusAwareStatusBar />
      <View className="w-full flex-1">
        <Cover />
      </View>
      <View className="justify-end">
        <Text variant="large-title" emphasized className="my-3 text-center">
          Obytes Starter
        </Text>
        <Text variant="body" className="mb-2 text-center text-gray-600">
          The right way to build your mobile app
        </Text>

        <Text variant="body" className="my-1 pt-6 text-left">
          🚀 Production-ready
          {' '}
        </Text>
        <Text variant="body" className="my-1 text-left">
          🥷 Developer experience + Productivity
        </Text>
        <Text variant="body" className="my-1 text-left">
          🧩 Minimal code and dependencies
        </Text>
        <Text variant="body" className="my-1 text-left">
          💪 well maintained third-party libraries
        </Text>
      </View>
      <SafeAreaView className="mt-6">
        <Button
          label="Let's Get Started "
          onPress={() => {
            setIsFirstTime(false);
            router.replace('/login');
          }}
        />
      </SafeAreaView>
    </View>
  );
}
