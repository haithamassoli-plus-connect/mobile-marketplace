import type { Accordion } from '../data';
import { useState } from 'react';

import { Button, Text, View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const NEUTRAL_500 = '#717680';

export function ProductTabs({ tabs }: { tabs: Accordion[] }) {
  const [openId, setOpenId] = useState<string | null>(tabs[0]?.id ?? null);
  return (
    <View className="gap-3 px-4 pt-3 pb-1.5">
      {tabs.map(tab => (
        <AccordionItem
          key={tab.id}
          tab={tab}
          open={tab.id === openId}
          onToggle={() => setOpenId(current => (current === tab.id ? null : tab.id))}
        />
      ))}
    </View>
  );
}

function AccordionItem({ tab, open, onToggle }: { tab: Accordion; open: boolean; onToggle: () => void }) {
  return (
    <View className="overflow-hidden rounded-xl border border-neutral-200">
      <Button
        variant="ghost"
        onPress={onToggle}
        className="my-0 h-auto rounded-none flex-row items-center justify-between bg-neutral-50 px-[14px] py-[13px]"
      >
        <Text variant="headline" className="text-neutral-900">{tab.title}</Text>
        <View style={{ transform: [{ rotate: open ? '180deg' : '0deg' }] }}>
          <Icon name="chevron-down" size={20} color={NEUTRAL_500} />
        </View>
      </Button>
      {open
        ? (
            <View className="px-[14px] py-3">
              <Text variant="footnote" className="text-neutral-600">{tab.body}</Text>
            </View>
          )
        : null}
    </View>
  );
}
