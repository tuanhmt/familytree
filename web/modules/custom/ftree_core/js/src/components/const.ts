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

export const HIERARCHY_FILTERS = {
  '3.1': {
    label: 'Vương Đình Liệu',
    sub_branches: {
      '4.1': 'Vương Thị Hai',
      '4.2': 'Vương Đình Mai',
      '4.3': 'Vương Đình Hòe',
      '4.10': 'Vương Thị Xinh'
    }
  },
  '3.2': {
    label: 'Vương Đình Đào',
    sub_branches: {
      '4.1': 'Vương Đình Bá',
      '4.2': 'Vương Thị Hai',
      '4.3': 'Vương Thị Tam',
      '4.4': 'Vương Đình Trinh'
    }
  }
} as Readonly<{ [key: string]: { label: string; sub_branches: { [key: string]: string } } }>;

export const DEFAULT_FILTER = Object.keys(FILTERS)[0];

export const DEFAULT_NODES = window.drupalSettings?.ftree_nodes ?? [];