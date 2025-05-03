import React from 'react';
import Modal from 'react-modal';
import ReactImageFallback from 'react-image-fallback';
import type { Node } from 'relatives-tree/lib/types';
import { PuffLoader } from 'react-spinners';
import css from './FamilyNodeModal.module.css';
import {useTranslation} from "react-i18next";

interface FamilyNodeModalProps {
  isOpen: boolean;
  onRequestClose: () => void;
  node: Readonly<Node> & {
    fullname?: string;
    birth_year?: string;
    death_year?: string;
    order?: string;
    avatar?: string;
  };
  selectedNode: any;
}

export const FamilyNodeModal: React.FC<FamilyNodeModalProps> = ({ isOpen, onRequestClose, node, selectedNode }) => {
  const {t} = useTranslation();

  const fields = {
    'full_name': t('common:components.fnd-component.full_name'),
    'gender': t('common:components.fnd-component.gender'),
    'nick_name': t('common:components.fnd-component.nick_name'),
    'saint_name': t('common:components.fnd-component.saint_name'),
    'father_name': t('common:components.fnd-component.father_name'),
    'mother_name': t('common:components.fnd-component.mother_name'),
    'birth_day': t('common:components.fnd-component.birth_day'),
    'phone_number': t('common:components.fnd-component.phone_number'),
    'email': t('common:components.fnd-component.email'),
  };

  return (
    <Modal
      isOpen={isOpen}
      onRequestClose={onRequestClose}
      className={css.modal}
      overlayClassName={css.overlay}
    >
      {node ? (
        <div>
          <button type="button" className={`btn btn-link p-0 ${css.modalCloseBtn}`} onClick={onRequestClose}>
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none">
              <path d="M7.05086 5.63616C6.66033 5.24563 6.02717 5.24563 5.63664 5.63616C5.24612 6.02668 5.24612 6.65984 5.63664 7.05037L10.5864 12.0001L5.63664 16.9499C5.24612 17.3404 5.24612 17.9736 5.63664 18.3641C6.02717 18.7546 6.66033 18.7546 7.05086 18.3641L12.0006 13.4143L16.9504 18.3641C17.3409 18.7546 17.974 18.7546 18.3646 18.3641C18.7551 17.9736 18.7551 17.3404 18.3646 16.9499L13.4148 12.0001L18.3646 7.05037C18.7551 6.65984 18.7551 6.02668 18.3646 5.63616C17.974 5.24563 17.3409 5.24563 16.9504 5.63616L12.0006 10.5859L7.05086 5.63616Z" fill="#0E0D0D" />
            </svg>
          </button>
          <div className="row">
            <div className="col-lg-4">
              <div className={css.avatar}>
                {window.drupalSettings?.ftree_user?.currentUserPermissions?.includes('administer family_node') && (
                  <a
                    href={`/family-node/${node.id}/edit`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={`btn btn-sm btn-primary rounded-circle ${css.editButton}`}
                    title={window.Drupal?.t('Edit') ?? 'Edit'}
                  >
                    <i className="fa fa-pencil" aria-hidden="true"></i>
                  </a>
                )}
                <ReactImageFallback
                  fallbackImage="/themes/custom/familytree/images/default_avatar.jpg"
                  className={css.avatarPlaceholder}
                  alt={node.fullname}
                  src={node.avatar}
                  draggable="false"
                />
              </div>
            </div>
            <div className="col-lg-8">
              <form className="px-2">
                {Object.entries(fields).map(([key, value], index) => (
                  <div className="form-group row mb-2" key={index}>
                    <div className="col-lg-6">{value}</div>
                    <div className="col-lg-6">
                      {String(node[key as keyof Node] ?? '')}
                    </div>
                  </div>
                ))}
              </form>
            </div>
          </div>
        </div>
      ) : (
        <div className={css.loading}>
          <PuffLoader color="#83251D" size={100} />
        </div>
      )}
    </Modal>
  );
};

export default FamilyNodeModal;
