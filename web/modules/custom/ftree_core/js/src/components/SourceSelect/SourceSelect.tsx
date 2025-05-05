import { memo, useState } from 'react';
import type { Node } from 'relatives-tree/lib/types';
import { URL_LABEL } from '../const';
import Select from 'react-select';

interface SourceSelectProps {
  value: string;
  items: Record<string, readonly Readonly<Node>[]>;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}

export const SourceSelect = memo(
  function SourceSelect({ value, items, onChange }: SourceSelectProps) {

    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string; } | null>(null);

    const options = Object.keys(items).map((item) => ({
      value: item,
      label: item,
    }));

    const handleChange = (newValue: { value: string; label: string; } | null) => {
      setSelectedOption(newValue);
      if (newValue) {
        onChange(newValue.value, items[newValue.value]);
      }
    };

    return (
      <Select
        defaultValue={selectedOption}
        options={options}
        onChange={handleChange}
        isSearchable={true}
        isClearable={true}
        isMulti={false}
        styles={{
          control: (baseStyles, state) => ({
            ...baseStyles,
            borderColor: state.isFocused ? '#E4E7EC' : '#E4E7EC',
            borderRadius: 'var(--bs-border-radius)',
            boxShadow: 'none',
            minWidth: '300px',
            fontSize: '13px',
            color: '#6c757d',
          }),
          placeholder: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '13px',
            color: '#6c757d',
          }),
          menu: (baseStyles, state) => ({
            ...baseStyles,
            fontSize: '13px',
            color: '#6c757d',
          }),
        }}
        />
    );
  },
);
