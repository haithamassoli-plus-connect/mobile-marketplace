import { View } from '@/components/ui';
import { Icon } from '@/features/home/components/icon';

// Shared star row. Lucide is a font glyph (no partial fill), so a "filled" star is
// the same glyph drawn gold and an "empty" one is drawn neutral — the repo's
// established pattern (see the home Rating primitive). Floor of `value` is filled.
const GOLD = '#dbb42c'; // gold-500
const EMPTY = '#d5d7da'; // neutral-300
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
