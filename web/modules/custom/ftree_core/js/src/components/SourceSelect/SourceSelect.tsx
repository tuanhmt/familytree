import { memo, useState } from 'react';
import type { Node, Relation } from 'relatives-tree/lib/types';
import Select from 'react-select';
import { DEFAULT_NODES, FILTERS } from '../const';
import { useTranslation } from 'react-i18next';
interface SourceSelectProps {
  value: string;
  items: Record<string, string>;
  rootId: string;
  onChange: (value: string, nodes: readonly Readonly<Node>[]) => void;
}

export const SourceSelect = memo(
  function SourceSelect({ value, items, rootId, onChange }: SourceSelectProps) {
    const { t } = useTranslation();
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
        let newNodes = DEFAULT_NODES.filter((node: any) =>
          (node.id == rootId)
          || (node.gender === "male" && node.parents.some((parent: any) => parent.type === "blood"))
        ).map((node: any) => ({
          ...node,
          spouses: []
        }));

        newNodes = fixFamilyTree(newNodes);
        return newNodes;
      }

      if (filter === 'generation') {
        // Promt a modal to select the generation number.
        const generation = prompt(t('common:components.filters.generation_prompt'));
        if (!generation || isNaN(parseInt(generation))) return [];
        let newNodes = DEFAULT_NODES.filter((node: any) =>
          (node.id == rootId) || node.generation === generation
        );

        const rootChildren = newNodes.filter((node: any) => node.id !== rootId).map((node: any) => ({
          id: node.id,
          type: 'blood',
        }));

        newNodes.forEach((node: any) => {
          node.spouses = [];
          node.parents = [];
          node.children = [];
          node.siblings = [];

          if (node.id !== rootId) {
            node.parents.push({ id: rootId, type: 'blood' });
          } else {
            node.children = rootChildren;
            node.fullname = t('common:components.filters.ancestors');
          }
        });

        console.log(newNodes);

        return newNodes;
      }

      return [];
    };

    const handleChange = (selectedOption: { value: string; label: string; } | null) => {
      setSelectedOption(selectedOption);
      if (!selectedOption) return;
      onChange(selectedOption.value, getNodesByFilter(selectedOption.value));
    };

    // Validate the family tree to ensure that the parents, children, spouses, and siblings are valid
    const validateFamilyTree = (nodes: any) => {
      const errors: any[] = [];
      const nodeMap = new Map();

      nodes.forEach((node: any) => nodeMap.set(node.id, node));

      nodes.forEach((node: any) => {
        const { id, spouses, parents, children, siblings } = node;

        // Check parents <-> children
        parents.forEach((p: any) => {
          const parent = nodeMap.get(p.id);
          if (!parent) {
            errors.push(`Parent with id ${p.id} of node ${id} does not exist.`);
            return;
          }
          const found = parent.children.some((c: any) => c.id === id && c.type === p.type);
          if (!found) {
            errors.push(`Missing reciprocal child reference from parent ${p.id} to child ${id}.`);
          }
        });

        // Check children <-> parents
        children.forEach((c: any) => {
          const child = nodeMap.get(c.id);
          if (!child) {
            errors.push(`Child with id ${c.id} of node ${id} does not exist.`);
            return;
          }
          const found = child.parents.some((p: any) => p.id === id && p.type === c.type);
          if (!found) {
            errors.push(`Missing reciprocal parent reference from child ${c.id} to parent ${id}.`);
          }
        });

        // Check spouses <-> spouses
        spouses.forEach((spouseId: any) => {
          const spouse = nodeMap.get(spouseId);
          if (!spouse) {
            errors.push(`Spouse with id ${spouseId} of node ${id} does not exist.`);
            return;
          }
          if (!spouse.spouses.includes(id)) {
            errors.push(`Missing reciprocal spouse reference from ${spouseId} to ${id}.`);
          }
        });

        // Check siblings <-> siblings
        siblings.forEach((siblingId: any) => {
          const sibling = nodeMap.get(siblingId);
          if (!sibling) {
            errors.push(`Sibling with id ${siblingId} of node ${id} does not exist.`);
            return;
          }
          if (!sibling.siblings.includes(id)) {
            errors.push(`Missing reciprocal sibling reference from ${siblingId} to ${id}.`);
          }
        });
      });

      return errors;
    }

    // Fix the family tree to ensure that the parents, children, spouses, and siblings are valid
    const fixFamilyTree = (currentNodes: Node[]): Node[] => {
      let newNodes = [];
      const nodeMap = new Map<string, Node>();
      currentNodes.forEach(node => nodeMap.set(node.id, node));

      for (const node of currentNodes) {
        let validParents: Relation[] = [];
        let validChildren: Relation[] = [];
        let validSpouses: Relation[] = [];
        let validSiblings: Relation[] = [];
        if (node.parents.length !== 0) {
          validParents = node.parents.filter(parent => nodeMap.has(parent.id));
        }
        if (node.children.length !== 0) {
          validChildren = node.children.filter(child => nodeMap.has(child.id));
        }
        if (node.spouses.length !== 0) {
          validSpouses = node.spouses.filter(spouse => nodeMap.has(spouse.id));
        }
        if (node.siblings.length !== 0) {
          validSiblings = node.siblings.filter(sibling => nodeMap.has(sibling.id));
        }
        newNodes.push({
          ...node,
          parents: validParents,
          children: validChildren,
          spouses: validSpouses,
          siblings: validSiblings
        });
      }
      return newNodes;
    }

    const options = Object.keys(items).map((item) => ({
      value: item,
      label: t('common:components.filters.' + item),
    }));

    return (
      <Select
        defaultValue={selectedOption}
        placeholder={t('common:components.filters.select_placeholder')}
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
