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
    const [nodes, setNodes] = useState(DEFAULT_SOURCE);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    // Modal handler.
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

    // Add canvas zoom handles
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

    // Filter handler.
    const [selectedFilters, setSelectedFilters] = useState<string[]>(['all']);

    // Disable default dropdown link handler.
    const preventDropdownClose = (e: React.MouseEvent) => {
      e.stopPropagation();
    };

    // On checkbox change handler.
    const handleFilterChange = (filter: string) => {
      if (filter === 'all') {
        if (selectedFilters.includes('all')) {
          setSelectedFilters([]);
        } else {
          setSelectedFilters(['all']);
        }
      } else {
        // const newFilters = selectedFilters.includes(filter)
        //   ? selectedFilters.filter((f) => f !== filter)
        //   : [...selectedFilters.filter((f) => f !== 'all'), filter];

        setSelectedFilters([filter]);
      }
    };


    // Submit filter and rebuild the tree.
    const applyFilterHandler = () => {

      console.log(selectedFilters);

      const cleanReferences = (filteredNodes: [],) => {
        // Step 2: Create a set of IDs of the filtered nodes
        const filteredNodeIds = new Set(filteredNodes.map((node: any) => node.id));

        // Step 3: Update the references in the remaining nodes
        const newNodes = filteredNodes.map((node: any) => {
          if (node.parents) {
            node.parents = node.parents.filter((parent: any) => filteredNodeIds.has(parent.id));
          }
          if (node.children) {
            node.children = node.children.filter((child: any) => filteredNodeIds.has(child.id));
          }
          if (node.spouses) {
            node.spouses = node.spouses.filter((spouse: any) => filteredNodeIds.has(spouse.id));
          }
          if (node.siblings) {
            node.siblings = node.siblings.filter((sibling: any) => filteredNodeIds.has(sibling.id));
          }

          if (!node.parents) {
            node.parents = [];
          }
          if (!node.children) {
            node.children = [];
          }
          if (!node.spouses) {
            node.spouses = [];
          }
          if (!node.siblings) {
            node.siblings = [];
          }
          return node;
        });

        return newNodes;
      }
      // Handle all selected.
      if (selectedFilters.includes('all')) {
        setNodes(DEFAULT_SOURCE);
        console.log(DEFAULT_SOURCE)
        // return;
      }

      if (selectedFilters.includes('blood')) {
        const newNodes = DEFAULT_SOURCE.filter((node: any) =>
          (node.id == rootId) || node.parents.some((parent: any) => parent.type === "blood")
        );
        setNodes(newNodes);
      }

      if (selectedFilters.includes('blood.male')) {
        console.log(DEFAULT_SOURCE)
        // Step 1: Filter the nodes based on your criteria
        const filteredNodes = DEFAULT_SOURCE.filter((node: any) =>
          (node.id == rootId) || ((node.gender == 'male') && node.parents.some((parent: any) => parent.type === "blood"))
        );

        const newNodes = cleanReferences(filteredNodes);
        setNodes(newNodes);
      }

      // Check if selectedFilters has an item start with generation_
      if (selectedFilters.some((item) => item.startsWith('generation'))) {
        console.log(DEFAULT_SOURCE)
        const generation = selectedFilters.find((item) => item.startsWith('generation'))?.split('_')[1];
        if (generation) {
          const filteredNodes = DEFAULT_SOURCE.filter((node: any) =>
            (node.id == rootId) || (node.generation == parseInt(generation))
          );

          const newNodes = cleanReferences(filteredNodes);

          // Set rootnode as parents of all nodes and set rootnode.chilren as all nodes.
          const rootNode = newNodes.find((node: any) => node.id == rootId);
          newNodes.forEach((node: any) => {
            if (node.id !== rootId) {
              node.parents = [rootNode];
              node.order = '';
              rootNode.children.push(node);
            } else {
              node.fullname = window.Drupal.t("Generation") + ' ' + generation;
              // disable click event on this.
              node.onClick = () => {};
            }
          });
          setNodes(newNodes);
        }
      }
    }

    const filterOptions = [
      { value: 'blood', label: window.Drupal.t('Display only blood (Male & Female)') },
      { value: 'blood.male', label: window.Drupal.t('Display only blood (Male)') },
      { value: 'generation', label: window.Drupal.t('Display by generation') },
    ];

    return (
      <div className={css.root}>
        {/* Move buttons outside of PinchZoomPan */}
        <div className={`btn-toolbar mb-3 sticky-top z-3 ${css.toolbar}`} role="toolbar" aria-label="Family tree button groups">
          <div className="btn-group btn-group-md me-2" role="group" aria-label="Zoom group">
            <button className='btn btn-outline-secondary' onClick={zoomIn}><i className='fa fa-plus'></i></button>
            <button className='btn btn-outline-secondary' onClick={zoomOut}><i className='fa fa-minus'></i></button>
            <button className='btn btn-outline-secondary' onClick={resetZoom}>{window.Drupal.t('Reset')}</button>
          </div>
          <div className="btn-group btn-group-md" role="group">
            <button id="btnGroupDrop1" type="button" className="btn btn-outline-secondary dropdown-toggle" data-bs-toggle="dropdown" aria-expanded="false">
              {window.Drupal.t('Filter')}
            </button>
            <ul className="dropdown-menu bg-white" aria-labelledby="btnGroupDrop1">
              <li>
                <a className="dropdown-item" href="#" onClick={preventDropdownClose}>
                  <div className="form-check">
                    <input
                      className="form-check-input"
                      type="checkbox"
                      id="all"
                      checked={selectedFilters.includes('all')}
                      onChange={() => handleFilterChange('all')}
                    />
                    <label className="form-check-label" htmlFor="flexCheckDefault">
                      {window.Drupal.t('All')}
                    </label>
                  </div>
                </a>
              </li>
              <li><hr className="dropdown-divider" /></li>
              {filterOptions.map((option) => (
                <li>
                  <a className="dropdown-item" onClick={preventDropdownClose}>
                    <div className="form-check">
                      <input
                        className="form-check-input"
                        name="flexRadioDefault"
                        type="radio"
                        checked={selectedFilters.includes(option.value)}
                        onChange={() => handleFilterChange(option.value)}
                        disabled={selectedFilters.includes('all')}
                      />
                      {option.value !== 'generation' && (
                        <>
                          <label className="form-check-label">
                            {option.label}
                          </label>
                        </>
                      )}
                      {option.value === 'generation' && (
                        <input
                          type="number"
                          className="form-control form-control-sm"
                          placeholder={window.Drupal.t("Enter generation")}
                          onChange={(e) => handleFilterChange(option.value + '_' + e.target.value)}
                        />
                      )}
                    </div>
                  </a>
                </li>
              ))}
              <li><hr className="dropdown-divider" /></li>
              <li>
                <a className="dropdown-item" href="#">
                  <button className='btn btn-primary btn-sm' onClick={() => applyFilterHandler()}>{window.Drupal.t("Apply")}</button>
                </a>
              </li>
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
