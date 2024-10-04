import averageTree from 'relatives-tree/samples/average-tree.json';
import couple from 'relatives-tree/samples/couple.json';
import diffParents from 'relatives-tree/samples/diff-parents.json';
import divorcedParents from 'relatives-tree/samples/divorced-parents.json';
import empty from 'relatives-tree/samples/empty.json';
import severalSpouses from 'relatives-tree/samples/several-spouses.json';
import simpleFamily from 'relatives-tree/samples/simple-family.json';
import testTreeN1 from 'relatives-tree/samples/test-tree-n1.json';
import testTreeN2 from 'relatives-tree/samples/test-tree-n2.json';
import type { Node } from 'relatives-tree/lib/types';

export const NODE_WIDTH = 150 * 2 + 24;
export const NODE_HEIGHT = 184 * 2 + 24;

declare global {
  interface Window { drupalSettings: any; }
}

export const SOURCES = {
  'DRUPAL': window.drupalSettings.ftree_nodes,
};

export const DEFAULT_SOURCE = Object.keys(SOURCES)[0];

export const URL_LABEL = 'URL (Gist, Paste.bin, ...)';
