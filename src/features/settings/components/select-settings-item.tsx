import type { OptionType } from '@/components/ui';
import type { TxKeyPath } from '@/lib/i18n';

import * as React from 'react';
import { Options, useModal } from '@/components/ui';

import { SettingsItem } from './settings-item';

type Props = {
  text: TxKeyPath;
  options: OptionType[];
  value?: OptionType['value'];
  onChange: (value: OptionType['value']) => void;
};

export function SelectSettingsItem({ text, options, value, onChange }: Props) {
  const modal = useModal();

  const selected = React.useMemo(
    () => options.find(option => option.value === value),
    [options, value],
  );

  const onSelect = React.useCallback(
    (option: OptionType) => {
      onChange(option.value);
      modal.dismiss();
    },
    [onChange, modal],
  );

  return (
    <>
      <SettingsItem text={text} value={selected?.label} onPress={modal.present} />
      <Options
        ref={modal.ref}
        options={options}
        onSelect={onSelect}
        value={selected?.value}
      />
    </>
  );
}
