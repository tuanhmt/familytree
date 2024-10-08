import React, { useMemo, useState, useCallback } from 'react';
import ReactFamilyTree from 'react-family-tree';
import { PinchZoomPan } from '../PinchZoomPan/PinchZoomPan';
import { FamilyNode } from '../FamilyNode/FamilyNode';
import { NODE_WIDTH, NODE_HEIGHT, DEFAULT_SOURCE } from '../const';
import { getNodeStyle } from './utils';
import Modal from 'react-modal';
import css from './App.module.css';
import ReactImageFallback from 'react-image-fallback';

export default React.memo(
  function App() {
    const [nodes] = useState(DEFAULT_SOURCE);

    const firstNodeId = useMemo(() => nodes[0].id, [nodes]);
    const [rootId, setRootId] = useState(firstNodeId);

    const [hoverId] = useState<string>();

    const resetRootHandler = useCallback(() => setRootId(firstNodeId), [firstNodeId]);

    // Add these state variables for the modal
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedNode, setSelectedNode] = useState<any>();

    const openModalHandler = useCallback((node: any) => {
      setSelectedNode(node);
      setIsModalOpen(true);
    }, []);

    const closeModalHandler = useCallback(() => {
      setSelectedNode(null);
      setIsModalOpen(false);
    }, []);

    return (
      <div className={css.root}>
        {nodes.length > 0 && (
          <PinchZoomPan min={0.05} max={1} captureWheel className={css.wrapper}>
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
        {/* Add this modal component */}
        <Modal
          isOpen={isModalOpen}
          onRequestClose={closeModalHandler}
          className={css.modal}
          overlayClassName={css.overlay}
        >
          {selectedNode && (
            <div>
              <button type="button" className={`btn btn-link ${css.modalCloseBtn}`} onClick={closeModalHandler}>
                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="#0E0D0D"/>
                </svg>
              </button>
              <div className="row">
                <div className="col-lg-4">
                  <div className={css.avatar}>
                    {window.drupalSettings?.ftree_user?.currentUserPermissions?.includes('administer family_node') && (
                      <a
                        href={`/family-node/${selectedNode.id}/edit`}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn btn-sm btn-primary rounded-circle ${css.editButton}`}
                        title={window.Drupal.t('Edit')}
                      >
                        <i className="fa fa-pencil" aria-hidden="true"></i>
                      </a>
                    )}
                    <ReactImageFallback
                      fallbackImage="/themes/custom/familytree/images/default_avatar.jpg"
                      className={css.avatarPlaceholder}
                      alt={selectedNode.fullname}
                      src={selectedNode.avatar}
                      draggable="false"
                    />
                  </div>
                </div>
                <div className="col-lg-8">
                  <form>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Fullname')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.fullname}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Nickname')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.nickname}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Saintname')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.saintname}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Birthday')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.birthday}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Deathday')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.deathday}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Gender')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.gender}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Fathername')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.fathername}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Mothername')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.mothername}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Living Address')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.livingaddress}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Phone Number')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.phone}/>
                      </div>
                    </div>
                    <div className="form-group row">
                      <label className="col-lg-6 col-form-label">{window.Drupal.t('Email')}</label>
                      <div className="col-lg-6">
                        <input type="text" readOnly={true} className="form-control-plaintext" value={selectedNode.email}/>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          )}
        </Modal>
      </div>
    );
  },
);