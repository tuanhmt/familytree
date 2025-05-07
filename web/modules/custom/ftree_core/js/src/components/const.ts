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
} as Readonly<{ [key: string]: string }>;

export const DEFAULT_FILTER = Object.keys(FILTERS)[0];

export const DEFAULT_NODES = window.drupalSettings?.ftree_nodes ?? [];