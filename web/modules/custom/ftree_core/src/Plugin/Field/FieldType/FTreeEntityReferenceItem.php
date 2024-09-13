<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Plugin\Field\FieldType;

use Drupal\Core\TypedData\DataDefinition;
use Drupal\Core\Field\FieldStorageDefinitionInterface;
use Drupal\Core\Field\Plugin\Field\FieldType\EntityReferenceItem;

/**
 * Defines the 'ftree_entity_reference' field type.
 *
 * @FieldType(
 *   id = "ftree_entity_reference",
 *   label = @Translation("FTree Entity reference"),
 *   description = @Translation("An entity field containing an entity reference to Ftree."),
*    category = "reference",
 *   default_widget = "ftree_entity_reference_autocomplete",
 *   default_formatter = "entity_reference_label",
 *   list_class = "\Drupal\Core\Field\EntityReferenceFieldItemList"
 * )
 */
final class FTreeEntityReferenceItem extends EntityReferenceItem {

  /**
   * {@inheritdoc}
   */
  public static function schema(FieldStorageDefinitionInterface $field_definition) {
    $schema = parent::schema($field_definition);

    // Add a new column for storing the relationship type.
    $schema['columns']['relationship_type'] = [
      'type' => 'varchar',
      'length' => 50,
      'not null' => FALSE,
    ];

    return $schema;
  }

  /**
   * {@inheritdoc}
   */
  public static function propertyDefinitions(FieldStorageDefinitionInterface $field_definition) {
    $properties = parent::propertyDefinitions($field_definition);

    // Define the 'relationship_type' as a sub-property of the field.
    $properties['relationship_type'] = DataDefinition::create('string')
      ->setLabel(t('Relationship Type'))
      ->setDescription(t('The type of relationship, e.g., married, divorced, blood.'));

    return $properties;
  }

  /**
   * {@inheritdoc}
   */
  public function setValue($values, $notify = TRUE) {
    parent::setValue($values, $notify);

    // Set the relationship_type value.
    if (isset($values['relationship_type'])) {
      $this->set('relationship_type', $values['relationship_type']);
    }
  }

  /**
   * {@inheritdoc}
   */
  public function getValue() {
    $value = parent::getValue();

    // Include the relationship_type in the field values.
    $value['relationship_type'] = $this->get('relationship_type')->getValue();

    return $value;
  }

  /**
   * {@inheritdoc}
   */
  public function isEmpty() {
    $is_empty = parent::isEmpty();
    return $is_empty && empty($this->get('relationship_type')->getValue());
  }

}
