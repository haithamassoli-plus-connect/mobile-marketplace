import type { Language } from '@/lib/i18n/resources';
import * as React from 'react';
import { translate, useSelectedLanguage } from '@/lib/i18n';

import { SelectSettingsItem } from './select-settings-item';

export function LanguageItem() {
  const { language, setLanguage } = useSelectedLanguage();

  const langs = React.useMemo(
    () => [
      { label: translate('settings.english'), value: 'en' },
      { label: translate('settings.arabic'), value: 'ar' },
    ],
    [],
  );

  const onChange = React.useCallback(
    (value: string | number) => setLanguage(value as Language),
    [setLanguage],
  );

  return (
    <SelectSettingsItem
      text="settings.language"
      options={langs}
      value={language}
      onChange={onChange}
    />
  );
}
