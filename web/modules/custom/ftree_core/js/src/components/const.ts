export const NODE_WIDTH = 150 * 2 + 24 * 2 + 4;
export const NODE_HEIGHT = 184 * 2 + 24 * 2 + 4;

export const ZOOM_STEP = 0.05;
export const MIN_ZOOM = 0.01;
export const MAX_ZOOM = 1;

declare global {
  interface Window { drupalSettings: any; }
  interface Window { Drupal: any; }
}

export const FILTERS = {
  'all': 'All',
  'blood': 'Blood',
  'blood_male': 'Blood Male',
  'generation': 'Generation',
  'branch': 'Branch',
} as Readonly<{ [key: string]: string }>;

export const BRANCHES = [
  {
    id: '3.1',
    label: 'Vương Đình Liệu',
    sub_branches: [
      {
        id: '4.1',
        label: 'Vương Đình Liệu',
      },
      {
        id: '4.2',
        label: 'Vương Đình Mai',
      },
      {
        id: '4.3',
        label: 'Vương Đình Hòe',
      },
      {
        id: '4.10',
        label: 'Vương Thị Xinh',
      }
    ]
  },
  {
    id: '3.2',
    label: 'Vương Đình Đào',
    sub_branches: [
      {
        id: '4.1',
        label: 'Vương Đình Bá',
      },
      {
        id: '4.2',
        label: 'Vương Thị Hai',
      },
      {
        id: '4.3',
        label: 'Vương Thị Tam',
      },
      {
        id: '4.4',
        label: 'Vương Đình Trinh',
      }
    ]
  }
] as Readonly<{ id: string; label: string; sub_branches: { id: string; label: string }[] }[]>;

export const DEFAULT_FILTER = Object.keys(FILTERS)[0];

export const DEFAULT_NODES = window.drupalSettings?.ftree_nodes ?? [];