import * as React from 'react';
import { useMMKVString } from 'react-native-mmkv';
import { Uniwind, useUniwind } from 'uniwind';

import { storage } from '../storage';

const SELECTED_THEME = 'SELECTED_THEME';
export type ColorSchemeType = 'light' | 'dark' | 'system';
export function useSelectedTheme() {
  const { theme: _theme } = useUniwind();
  const [theme, _setTheme] = useMMKVString(SELECTED_THEME, storage);

  const setSelectedTheme = React.useCallback(
    (t: ColorSchemeType) => {
      Uniwind.setTheme(t);
      _setTheme(t);
    },
    [_setTheme],
  );

  const selectedTheme = (theme ?? 'light') as ColorSchemeType;
  return { selectedTheme, setSelectedTheme } as const;
}
export function loadSelectedTheme() {
  const theme = storage.getString(SELECTED_THEME);
  Uniwind.setTheme((theme ?? 'light') as ColorSchemeType);
}
