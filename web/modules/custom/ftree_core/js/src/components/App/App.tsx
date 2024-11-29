import React, { useMemo, useState, useCallback, useEffect, useRef } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NODE_WIDTH, NODE_HEIGHT, DEFAULT_SOURCE } from '../const';
import { getNodeStyle } from './utils';
import css from './App.module.css';
import FamilyNodeModal from '../FamilyNode/FamilyNodeModal';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';

export default React.memo(
  function App() {
    const [nodes] = useState(DEFAULT_SOURCE);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [hoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>();
    const [fullNodeData, setFullNodeData] = useState<any>(null);

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

    // Add canvas handles
    const canvasRef = useRef<any>(null);
    const zoomStep = 0.05;
    const minZoom = 0.01;
    const maxZoom = 1;

    const zoomIn = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.min(prev.z + zoomStep, maxZoom || 1) }));
      }
    }, []);

    const zoomOut = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update((prev: any) => ({ z: Math.max(prev.z - zoomStep, minZoom || 0.05) }));
      }
    }, []);

    const resetZoom = useCallback(() => {
      if (canvasRef.current) {
        canvasRef.current.update({ x: 0, y: 250, z: 0.1 });
      }
    }, []);

    return (
      <div className={css.root}>
        {/* Move buttons outside of PinchZoomPan */}
        <div className={`btn-toolbar mb-3 sticky-top z-3 ${css.toolbar}`} role="toolbar" aria-label="Family tree button groups">
          <div className="btn-group btn-group-md me-2" role="group" aria-label="Zoom group">
            <button className='btn btn-outline-secondary' onClick={zoomIn}><i className='fa fa-plus'></i></button>
            <button className='btn btn-outline-secondary' onClick={zoomOut}><i className='fa fa-minus'></i></button>
            <button className='btn btn-outline-secondary' onClick={resetZoom}>{window.Drupal?.t('Reset') ?? 'Reset'}</button>
          </div>
          <div className="btn-group btn-group-md" role="group">
            <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              {window.Drupal?.t('Filter') ?? 'Filter'}
            </button>
            <ul className="dropdown-menu bg-white" aria-labelledby="btnGroupDrop1">
              <li><a className="dropdown-item" href="#">Dropdown link</a></li>
              <li><a className="dropdown-item" href="#">Dropdown link</a></li>
            </ul>
          </div>
        </div>
        {nodes.length > 0 && (
          <PinchZoomPan min={minZoom} max={maxZoom} captureWheel className={css.wrapper} canvasRef={canvasRef}>
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
          fullNodeData={fullNodeData}
          selectedNode={selectedNode}
        />
      </div>
    );
  },
);
