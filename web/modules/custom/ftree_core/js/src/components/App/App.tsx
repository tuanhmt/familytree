import React, { useMemo, useState, useCallback } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NodeDetails } from '../NodeDetails/NodeDetails';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE } from '../const';
import { getNodeStyle } from './utils';

import css from './App.module.css';

export default React.memo(
  function App() {
    // const [source, setSource] = useState(DEFAULT_SOURCE);
    const [nodes, setNodes] = useState(window.drupalSettings.ftree_nodes);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [selectId, setSelectId] = useState<string>();
    const [hoverId, setHoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    return (
      <div className={css.root}>
        {nodes.length > 0 && (
          <PinchZoomPan min={0.1} max={2} captureWheel className={css.wrapper}>
            <ReactFamilyTree
              nodes={nodes}
              rootId={rootId}
              width={NODE_WIDTH}
              height={NODE_HEIGHT}
              className={css.tree}
              renderNode={(node) => (
                <FamilyNode
                  key={node.id}
                  node={node}
                  isRoot={node.id === rootId}
                  isHover={node.id === hoverId}
                  onClick={setSelectId}
                  onSubClick={setRootId}
                  style={getNodeStyle(node)}
                />
              )}
            />
          </PinchZoomPan>
        )}
        {rootId !== firstNodeId && (
          <button className={css.reset} onClick={resetRootHandler}>
            Reset
          </button>
        )}
      </div>
    );
  },
);
