import defaultSource from './defaultSource.json';
import type { Node } from 'relatives-tree/lib/types';
import averageTree from 'relatives-tree/samples/average-tree.json';

export const NODE_WIDTH = 150 * 2 + 24 * 2 + 4;
export const NODE_HEIGHT = 184 * 2 + 24 * 2 + 4;

export const ZOOM_STEP = 0.05;
export const MIN_ZOOM = 0.01;
export const MAX_ZOOM = 1;

declare global {
  interface Window { drupalSettings: any; }
  interface Window { Drupal: any; }
}

export const SOURCES = {
  'defaultSource.json': window.drupalSettings?.ftree_nodes ?? defaultSource,
  'average-tree.json': averageTree,
} as Readonly<{ [key: string]: readonly Readonly<Node>[] }>;

export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];

export const URL_LABEL = 'URL (Gist, Paste.bin, ...)';

