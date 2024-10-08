export const NODE_WIDTH = 150 * 2 + 24 * 2 + 4;
export const NODE_HEIGHT = 184 * 2 + 24 * 2 + 4;

declare global {
  interface Window { drupalSettings: any; }
  interface Window { Drupal: any; }
}

export const DEFAULT_SOURCE =  window.drupalSettings.ftree_nodes;

