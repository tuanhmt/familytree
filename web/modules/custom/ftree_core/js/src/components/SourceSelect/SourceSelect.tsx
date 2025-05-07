import { memo, useState } from 'react';
import type { Node } from 'relatives-tree/lib/types';
import Select from 'react-select';
import { DEFAULT_NODES, FILTERS } from '../const';
import { useTranslation } from 'react-i18next';
interface SourceSelectProps {
  value: string;
  items: Record<string, string>;
  rootId: number;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}

export const SourceSelect = memo(
  function SourceSelect({ value, items, rootId, onChange }: SourceSelectProps) {
    const {t} = useTranslation();
    const [selectedOption, setSelectedOption] = useState<{ value: string; label: string; } | null>({ value: value, label: t('common:components.filters.' + value) });


    const getNodesByFilter = (filter: string) => {
      if (filter === 'all') {
        return DEFAULT_NODES;
      }

      if (filter === 'blood') {
        return DEFAULT_NODES.filter((node: any) =>
          (node.id == rootId) || node.parents.some((parent: any) => parent.type === "blood")
        );
      }

      if (filter === 'blood_male') {
        return DEFAULT_NODES.filter((node: any) =>
          (node.id == rootId)
          || (node.gender === "male" && node.parents.some((parent: any) => parent.type === "blood"))
        ).map((node: any) => ({
          ...node,
          spouses: []
        }));
      }

      return [];
    };

    const handleChange = (selectedOption: { value: string; label: string; } | null) => {
      alert(selectedOption?.value);
      setSelectedOption(selectedOption);
      if (!selectedOption) return;
      onChange(selectedOption.value, getNodesByFilter(selectedOption.value));
    };

    const options = Object.keys(items).map((item) => ({
      value: item,
      label: t('common:components.filters.' + item),
    }));

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
