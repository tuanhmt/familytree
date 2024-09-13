<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Plugin\Field\FieldWidget;

use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Field\FieldItemListInterface;
use Drupal\Core\Field\Plugin\Field\FieldWidget\EntityReferenceAutocompleteWidget;

/**
 * Defines the 'ftree_entity_reference_autocomplete' field widget.
 *
 * @FieldWidget(
 *   id = "ftree_entity_reference_autocomplete",
 *   label = @Translation("FTree Autocomplete"),
 *   field_types = {"ftree_entity_reference"},
 * )
 */
final class FTreeEntityReferenceAutocompleteWidget extends EntityReferenceAutocompleteWidget {

  /**
   * {@inheritdoc}
   */
  public function formElement(FieldItemListInterface $items, $delta, array $element, array &$form, FormStateInterface $form_state) {
    $element = parent::formElement($items, $delta, $element, $form, $form_state);

    if ($items->name == 'spouses') {
      $a = 10;
    }
    // Add a dropdown or text field to select the relationship type.
    $element['relationship_type'] = [
      '#type' => 'select',
      '#title' => $this->t('Relationship Type'),
      '#options' => self::getSelectOptions(),
      '#default_value' => $items[$delta]?->relationship_type,
      "#empty_option" => $this->t('- None -'),
      '#weight' => 50,
      '#states' => [
        'visible' => [
          ':input[name="attached[is_attached]"]' => ['checked' => TRUE],
        ],
        'required' => [
          ':input[name="attached[is_attached]"]' => ['checked' => TRUE],
        ],
      ],
    ];

    return $element;
  }

  /**
   * {@inheritdoc}
   */
  public function extractFormValues(FieldItemListInterface $items, array $form, FormStateInterface $form_state) {
    parent::extractFormValues($items, $form, $form_state);
    $values = $form_state->getValue($items->getName());

    // Get the relationship type from form input and set it.
    foreach ($items as $delta => $item) {
      if (isset($values[$delta]['relationship_type'])) {
        $item->set('relationship_type', $values[$delta]['relationship_type']);
      }
    }
  }

  /**
   * Returns an array of relationship type options with translatable labels.
   *
   * @return array
   *   The array of select options.
   */
  public static function getSelectOptions() {
    return [
      'married' => t('Married'),
      'divorced' => t('Divorced'),
      'blood' => t('Blood'),
      'adopted' => t('Adopted'),
      'half' => t('Half'),
    ];
  }

}
