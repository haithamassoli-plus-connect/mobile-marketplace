import * as React from 'react';

import { Text, View } from '@/components/ui';

type Props = {
  text: string;
};
export function Title({ text }: Props) {
  return (
    <View className="flex-row items-center justify-center py-4 pb-2">
      <Text variant="title-2" className="pr-2">{text}</Text>
      <View className="h-[2px] flex-1 bg-neutral-300" />
    </View>
  );
}
