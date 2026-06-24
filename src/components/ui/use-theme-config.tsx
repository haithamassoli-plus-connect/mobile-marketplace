import {
  DarkTheme as _DarkTheme,
  DefaultTheme,
} from 'expo-router';
import { useUniwind } from 'uniwind';

import colors from '@/components/ui/colors';

const DarkTheme = {
  ..._DarkTheme,
  colors: {
    ..._DarkTheme.colors,
    primary: colors.primary[200],
    background: colors.neutral[950],
    text: colors.neutral[100],
    border: colors.neutral[500],
    card: colors.neutral[800],
  },
};

const LightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    primary: colors.primary[400],
    background: colors.white,
  },
};

export function useThemeConfig() {
  const { theme } = useUniwind();

  if (theme === 'dark')
    return DarkTheme;

  return LightTheme;
}
