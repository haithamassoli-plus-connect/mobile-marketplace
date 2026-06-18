import type { ColorSchemeType } from '@/lib/hooks/use-selected-theme';
import * as React from 'react';
import { useSelectedTheme } from '@/lib/hooks/use-selected-theme';
import { translate } from '@/lib/i18n';

import { SelectSettingsItem } from './select-settings-item';

export function ThemeItem() {
  const { selectedTheme, setSelectedTheme } = useSelectedTheme();

  const themes = React.useMemo(
    () => [
      { label: `${translate('settings.theme.dark')} 🌙`, value: 'dark' },
      { label: `${translate('settings.theme.light')} 🌞`, value: 'light' },
      { label: `${translate('settings.theme.system')} ⚙️`, value: 'system' },
    ],
    [],
  );

  const onChange = React.useCallback(
    (value: string | number) => setSelectedTheme(value as ColorSchemeType),
    [setSelectedTheme],
  );

  return (
    <SelectSettingsItem
      text="settings.theme.title"
      options={themes}
      value={selectedTheme}
      onChange={onChange}
    />
  );
}
