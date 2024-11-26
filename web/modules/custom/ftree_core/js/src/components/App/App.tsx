import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NODE_WIDTH, NODE_HEIGHT, DEFAULT_SOURCE } from '../const';
import { getNodeStyle } from './utils';
import css from './App.module.css';
import FamilyNodeModal from '../FamilyNode/FamilyNodeModal';

import {
  TransformWrapper,
  TransformComponent,
  useControls,
} from "react-zoom-pan-pinch";

const Controls = () => {
  const { zoomIn, zoomOut, resetTransform, centerView } = useControls();

  return (
    <div className="tools">
      <button className='btn btn-primary' onClick={() => zoomIn()}>+</button>
      <button className='btn btn-primary' onClick={() => zoomOut()}>-</button>
      <button className='btn btn-primary' onClick={() => resetTransform()}>Reset</button>
      <button className='btn btn-primary' onClick={() => centerView()}>Center</button>
    </div>
  );
};

export default React.memo(
  function App() {
    const [nodes] = useState(DEFAULT_SOURCE);
    const [isLoading, setIsLoading] = useState(() => !window.drupalSettings?.ftree_nodes);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [hoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>();
    const [fullNodeData, setFullNodeData] = useState<any>(null);

    const containerRef = useRef(null);
    const [initialTransform, setInitialTransform] = useState({ x: -26381, y: 100, scale: 0.3 });

    const openModalHandler = useCallback((node: any) => {
      setSelectedNode(node);
      setIsModalOpen(true);
    }, []);

    const closeModalHandler = useCallback(() => {
      setSelectedNode(null);
      setIsModalOpen(false);
      setFullNodeData(null);
    }, []);

    useEffect(() => {
      if (isModalOpen && selectedNode) {
        fetch(`/api/v1.0/family-node/${selectedNode.id}`)
          .then(response => {
            if (!response.ok) {
              throw new Error('Network response was not ok');
            }
            return response.json();
          })
          .then(data => {
            setFullNodeData(data);
          })
          .catch(error => {
            console.error('Error fetching family node data:', error);
          });
      }
    }, [isModalOpen, selectedNode]);

    return (
      <div
        ref={containerRef}
        style={{ width: "100%", height: "100%", overflow: "hidden", position: "relative" }}
      >
        {nodes.length > 0 && (
          <TransformWrapper
            minScale={0.05}
            maxScale={1}
            initialScale={initialTransform.scale}
            initialPositionX={initialTransform.x}
            initialPositionY={initialTransform.y}
            centerZoomedOut={0}
            // disablePadding={1}
            limitToBounds={0}
            pinch={{
              step: 1,
            }}
            doubleClick={{
              step: 0.1,
            }}
          >
            <Controls />
            <TransformComponent>
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
                    onClick={openModalHandler}
                    onSubClick={setRootId}
                    style={getNodeStyle(node)}
                  />
                )}
              />
            </TransformComponent>
          </TransformWrapper>
        )}
        {rootId !== firstNodeId && (
          <button className={css.reset} onClick={resetRootHandler}>
            Reset
          </button>
        )}
        <FamilyNodeModal
          isOpen={isModalOpen}
          onRequestClose={closeModalHandler}
          fullNodeData={fullNodeData}
          selectedNode={selectedNode}
        />
      </div>
    );
  },
);
