import { View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

const GOLD = '#dbb42c';
const EMPTY = '#d5d7da';
const SLOTS = ['s1', 's2', 's3', 's4', 's5'];

export function Stars({ value, size }: { value: number; size: number }) {
  const filled = Math.floor(value);
  return (
    <View className="flex-row items-center gap-0.5">
      {SLOTS.map((slot, i) => (
        <Icon key={slot} name="star" size={size} color={i < filled ? GOLD : EMPTY} />
      ))}
    </View>
  );
}
