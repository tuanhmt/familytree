import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import type { Node, ExtNode } from 'relatives-tree/lib/types';
import { NODE_WIDTH, NODE_HEIGHT, SOURCES, DEFAULT_SOURCE, MIN_ZOOM, MAX_ZOOM, ZOOM_STEP } from '../const';
import { getNodeStyle } from './utils';
import css from './App.module.css';
import FamilyNodeModal from '../FamilyNode/FamilyNodeModal';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { SourceSelect } from '../SourceSelect/SourceSelect';


export default React.memo(
  function App() {
    const [source, setSource] = useState(DEFAULT_SOURCE);
    const [nodes, setNodes] = useState(SOURCES[source]);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);
    // Modal handler.
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>();
    const [fullNodeData, setFullNodeData] = useState<any>(null);

    const changeSourceHandler = useCallback(
      (value: string, nodes: readonly Readonly<Node>[]) => {
        setRootId(nodes[0].id);
        setNodes(nodes);
        setSource(value);
      },
      [],
    );

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

    // Add canvas zoom handles
    const canvasRef = useRef<any>(null);

    const zoomIn = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.min(prev.z + ZOOM_STEP, MAX_ZOOM) }));
      }
    }, []);

    const zoomOut = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.max(prev.z - ZOOM_STEP, MIN_ZOOM) }));
      }
    }, []);

    const resetZoom = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update({ x: 0, y: 250, z: 0.1 });
      }
    }, []);

    return (
      <div className={css.root}>
        <header className={css.header}>
          <div className={`btn-toolbar mb-3 sticky-top z-3 ${css.toolbar}`} role="toolbar" aria-label="Family tree button groups">
            <div className="btn-group btn-group-md me-2" role="group" aria-label="Zoom group">
              <button className='btn btn-outline-secondary' onClick={zoomIn}><i className='fa fa-plus'></i></button>
              <button className='btn btn-outline-secondary' onClick={zoomOut}><i className='fa fa-minus'></i></button>
              <button className='btn btn-outline-secondary' onClick={resetZoom}>{window.Drupal.t('Reset')}</button>
            </div>
            <div className='btn-group btn-group-md me-2'>
              <SourceSelect value={source} items={SOURCES} onChange={changeSourceHandler} />
            </div>
          </div>
        </header>
        {nodes.length > 0 && (
          <PinchZoomPan min={MIN_ZOOM} max={MAX_ZOOM} captureWheel className={css.wrapper} canvasRef={canvasRef}>
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
                  onClick={openModalHandler}
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
        <FamilyNodeModal
          isOpen={isModalOpen}
          onRequestClose={closeModalHandler}
          node={fullNodeData}
          selectedNode={selectedNode}
        />
      </div>
    );
  },
);
