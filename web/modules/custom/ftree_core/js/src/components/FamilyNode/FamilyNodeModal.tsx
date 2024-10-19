import React from 'react';
import Modal from 'react-modal';
import ReactImageFallback from 'react-image-fallback';
import css from './FamilyNodeModal.module.css';

interface FamilyNodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  fullNodeData: any;
  selectedNode: any;
}

const FamilyNodeModal: React.FC<FamilyNodeModalProps> = ({ isOpen, onRequestClose, fullNodeData, selectedNode }) => {
  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={css.modal}
      overlayClassName={css.overlay}
    >
      {fullNodeData ? (
        <div>
          <button type="button" className={`btn btn-link ${css.modalCloseBtn}`} onClick={onRequestClose}>
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
                {['fullname', 'nickname', 'saintname', 'gender', 'fathername', 'mothername', 'livingaddress', 'phone', 'email'].map((field) => (
                  <div className="form-group row" key={field}>
                    <label className="col-lg-6 col-form-label">{window.Drupal.t(field.charAt(0).toUpperCase() + field.slice(1))}</label>
                    <div className="col-lg-6">
                      <input type="text" readOnly={true} className="form-control-plaintext" value={fullNodeData[field]}/>
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className={css.loading}>Loading...</div>
      )}
    </Modal>
  );
};

export default FamilyNodeModal;
