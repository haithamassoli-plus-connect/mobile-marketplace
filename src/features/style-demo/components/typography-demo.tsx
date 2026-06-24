import * as React from 'react';

import { Text, View } from '@/components/ui';

import { Title } from './title';

export function Typography() {
  return (
    <>
      <Title text="Typography" />
      <View className="mb-4 flex-col">
        <Text variant="title-1" className="tracking-tight">
          H1: Lorem ipsum dolor sit
        </Text>
        <Text variant="title-2">H2: Lorem ipsum dolor sit</Text>
        <Text variant="title-3">H3: Lorem ipsum dolor sit</Text>
        <Text variant="headline">H4: Lorem ipsum dolor sit</Text>
        <Text variant="body">
          Lorem ipsum dolor sit amet consectetur, adipisicing elit. Cumque quasi
          aut, expedita tempore ratione quidem in, corporis quia minus et
          dolorem sunt temporibus iusto consequatur culpa. Omnis sequi debitis
          recusandae?
        </Text>
      </View>
    </>
  );
}
