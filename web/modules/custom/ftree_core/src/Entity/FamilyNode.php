<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Entity;

use Drupal\Core\Entity\ContentEntityBase;
use Drupal\Core\Entity\EntityStorageInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Field\BaseFieldDefinition;
use Drupal\ftree_core\FamilyNodeInterface;
use Drupal\user\EntityOwnerTrait;

/**
 * Defines the family node entity class.
 *
 * @ContentEntityType(
 *   id = "family_node",
 *   label = @Translation("Family Node"),
 *   label_collection = @Translation("Family Nodes"),
 *   label_singular = @Translation("family node"),
 *   label_plural = @Translation("family nodes"),
 *   label_count = @PluralTranslation(
 *     singular = "@count family nodes",
 *     plural = "@count family nodes",
 *   ),
 *   handlers = {
 *     "list_builder" = "Drupal\ftree_core\FamilyNodeListBuilder",
 *     "views_data" = "Drupal\views\EntityViewsData",
 *     "form" = {
 *       "add" = "Drupal\ftree_core\Form\FamilyNodeForm",
 *       "edit" = "Drupal\ftree_core\Form\FamilyNodeForm",
 *       "delete" = "Drupal\Core\Entity\ContentEntityDeleteForm",
 *       "delete-multiple-confirm" = "Drupal\Core\Entity\Form\DeleteMultipleForm",
 *     },
 *     "route_provider" = {
 *       "html" = "Drupal\Core\Entity\Routing\AdminHtmlRouteProvider",
 *     },
 *   },
 *   base_table = "family_node",
 *   admin_permission = "administer family_node",
 *   entity_keys = {
 *     "id" = "id",
 *     "label" = "fullname",
 *     "uuid" = "uuid",
 *     "owner" = "uid",
 *   },
 *   links = {
 *     "collection" = "/admin/content/family-node",
 *     "add-form" = "/family-node/add",
 *     "canonical" = "/family-node/{family_node}",
 *     "edit-form" = "/family-node/{family_node}/edit",
 *     "delete-form" = "/family-node/{family_node}/delete",
 *     "delete-multiple-form" = "/admin/content/family-node/delete-multiple",
 *   },
 *   field_ui_base_route = "entity.family_node.settings",
 * )
 */
final class FamilyNode extends ContentEntityBase implements FamilyNodeInterface {

  use EntityOwnerTrait;

  /**
   * {@inheritdoc}
   */
  public function preSave(EntityStorageInterface $storage): void {
    parent::preSave($storage);
    if (!$this->getOwnerId()) {
      // If no owner has been set explicitly, make the anonymous user the owner.
      $this->setOwnerId(0);
    }
  }

  /**
   * {@inheritdoc}
   */
  public static function baseFieldDefinitions(EntityTypeInterface $entity_type): array {

    $fields = parent::baseFieldDefinitions($entity_type);

    $fields['id'] = BaseFieldDefinition::create('integer')
      ->setLabel(t('ID'))
      ->setReadOnly(TRUE);

    $fields['uuid'] = BaseFieldDefinition::create('uuid')
      ->setLabel(t('UUID'))
      ->setReadOnly(TRUE);

    $fields['fullname'] = BaseFieldDefinition::create('string')
      ->setLabel(t('Label'))
      ->setRequired(TRUE)
      ->setSetting('max_length', 255)
      ->setDisplayOptions('form', [
        'type' => 'string_textfield',
        'weight' => -5,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayOptions('view', [
        'label' => 'hidden',
        'type' => 'string',
        'weight' => -5,
      ])
      ->setDisplayConfigurable('view', TRUE);

    $fields['description'] = BaseFieldDefinition::create('text_long')
      ->setLabel(t('Description'))
      ->setDisplayOptions('form', [
        'type' => 'text_textarea',
        'weight' => 10,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayOptions('view', [
        'type' => 'text_default',
        'label' => 'above',
        'weight' => 10,
      ])
      ->setDisplayConfigurable('view', TRUE);

    $fields['avatar'] = BaseFieldDefinition::create('file')
      ->setLabel('Image')
      ->setSettings([
        'uri_scheme' => 'public',
        'file_directory' => 'avatar',
        'file_extensions' => 'png jpg jpeg',
      ])
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'file',
        'weight' => -3,
      ])
      ->setDisplayOptions('form', [
        'type' => 'file',
        'weight' => -1,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['gender'] = BaseFieldDefinition::create('list_integer')
      ->setLabel(t('Gender'))
      ->setDefaultValue(200)
      ->setSettings([
        'allowed_values' => [
          'male' => 'Male',
          'female' => 'Female',
        ],
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['spouses'] = BaseFieldDefinition::create('map')
      ->setLabel(t('Spouses'))
      ->setSettings([
        'type' => 'json',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['siblings'] = BaseFieldDefinition::create('map')
      ->setLabel(t('Siblings'))
      ->setSettings([
        'type' => 'json',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['parents'] = BaseFieldDefinition::create('map')
      ->setLabel(t('Parents'))
      ->setSettings([
        'type' => 'json',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['children'] = BaseFieldDefinition::create('map')
      ->setLabel(t('Children'))
      ->setSettings([
        'type' => 'json',
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayConfigurable('view', TRUE);

    $fields['uid'] = BaseFieldDefinition::create('entity_reference')
      ->setLabel(t('Author'))
      ->setSetting('target_type', 'user')
      ->setDefaultValueCallback(self::class . '::getDefaultEntityOwner')
      ->setDisplayOptions('form', [
        'type' => 'entity_reference_autocomplete',
        'settings' => [
          'match_operator' => 'CONTAINS',
          'size' => 60,
          'placeholder' => '',
        ],
        'weight' => 15,
      ])
      ->setDisplayConfigurable('form', TRUE)
      ->setDisplayOptions('view', [
        'label' => 'above',
        'type' => 'author',
        'weight' => 15,
      ])
      ->setDisplayConfigurable('view', TRUE);

    return $fields;
  }

}
