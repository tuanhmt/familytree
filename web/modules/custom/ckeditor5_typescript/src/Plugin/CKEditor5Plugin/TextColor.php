<?php

declare(strict_types=1);

namespace Drupal\ckeditor5_typescript\Plugin\CKEditor5Plugin;

use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableInterface;
use Drupal\ckeditor5\Plugin\CKEditor5PluginConfigurableTrait;
use Drupal\ckeditor5\Plugin\CKEditor5PluginDefault;
use Drupal\Core\Form\FormStateInterface;
use Drupal\editor\EditorInterface;

/**
 * CKEditor 5 Text color Plugin.
 *
 * @internal
 *   Plugin classes are internal.
 */
class TextColor extends CKEditor5PluginDefault implements CKEditor5PluginConfigurableInterface {

  use CKEditor5PluginConfigurableTrait;

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'colors' => [],
      'use_default_colors' => TRUE,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state): array {

    $form['use_default_colors'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Use default colors'),
      '#description' => $this->t('Default default colors provided by plugin.'),
      '#default_value' => $this->configuration['use_default_colors'] ?? TRUE,
    ];

    $form['custom_colors_wrapper'] = [
      '#type' => 'fieldset',
      '#id' => 'custom-colors-wrapper',
    ];

    if ($this->configuration['use_default_colors']) {
      $form['custom_colors_wrapper']['#access'] = FALSE;
    }

    $colors = $this->configuration['colors'];
    if ($form_state->isRebuilding()) {
      $userInput = $form_state->getUserInput();
      $colors = $userInput['editor']['settings']['plugins']['ckeditor5_typescript_text_color']['custom_colors_wrapper'];
    }

    foreach ($colors as $colorId => $option) {
      $form['custom_colors_wrapper'][$colorId] = [
        '#type' => 'fieldset',
        '#id' => 'colors-container',
      ];

      $form['custom_colors_wrapper'][$colorId]['model'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Color ID'),
        '#maxlength' => 255,
        '#default_value' => $option['model'] ?? '',
      ];

      $form['custom_colors_wrapper'][$colorId]['class'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Color class'),
        '#maxlength' => 255,
        '#default_value' => $option['class'] ?? '',
      ];

      $form['custom_colors_wrapper'][$colorId]['title'] = [
        '#type' => 'textfield',
        '#title' => $this->t('Color label'),
        '#maxlength' => 255,
        '#default_value' => $option['title'] ?? '',
      ];

      $form['custom_colors_wrapper'][$colorId]['color'] = [
        '#type' => 'color',
        '#title' => $this->t('Color'),
        '#default_value' => $option['color'] ?? '',
      ];

      $form['custom_colors_wrapper'][$colorId]['delete'] = [
        '#type' => 'submit',
        '#value' => $this->t('Remove'),
        '#name' => 'color-' . $colorId . '-delete',
        '#button_type' => 'danger',
        '#submit' => [[$this, 'removeColor']],
        '#ajax' => [
          'callback' => [$this, 'refreshColorsCallback'],
          'wrapper' => 'custom-colors-wrapper',
        ],
        '#attributes' => [
          'data-color-id' => $colorId,
        ],
      ];
    }

    $form['custom_colors_wrapper']['add_custom_marker'] = [
      '#type' => 'submit',
      '#value' => $this->t('Add Color'),
      '#submit' => [[$this, 'addCustomColor']],
      '#ajax' => [
        'callback' => [$this, 'refreshColorsCallback'],
        'wrapper' => 'custom-colors-wrapper',
      ],
    ];
    return $form;
  }

  /**
   * Implement submit handler.
   */
  public function addCustomColor(array &$form, FormStateInterface $form_state): void {
    $userInput = $form_state->getUserInput();
    $userInput['editor']['settings']['plugins']['ckeditor5_typescript_text_color']['custom_colors_wrapper'][] = [];
    $form_state->setUserInput($userInput);
    $form_state->setRebuild();
  }

  /**
   * Implement submit handler.
   */
  public function removeColor(array &$form, FormStateInterface $form_state): void {
    $trigger = $form_state->getTriggeringElement();
    $id = $trigger['#attributes']['data-color-id'];
    $userInput = $form_state->getUserInput();
    $plugin = $userInput['editor']['settings']['plugins']['ckeditor5_typescript_text_color']['custom_colors_wrapper'];
    if (isset($plugin[$id])) {
      unset($plugin[$id]);
    }
    $userInput['editor']['settings']['plugins']['ckeditor5_typescript_text_color']['custom_colors_wrapper'] = $plugin;
    $form_state->setUserInput($userInput);

    $form_state->setRebuild();
  }

  /**
   * Refresh colors wrapper callback.
   */
  public function refreshColorsCallback(array &$form, FormStateInterface $form_state): array {
    $settings_element = $form['editor']['settings']['subform']['plugins']['ckeditor5_typescript_text_color'] ?? $form;
    return $settings_element['custom_colors_wrapper'] ?? $settings_element;
  }

  /**
   * {@inheritdoc}
   */
  public function validateConfigurationForm(array &$form, FormStateInterface $form_state): void {
    $trigger = $form_state->getTriggeringElement();
    if (str_contains($trigger['#id'], 'plugins-ckeditor5-typescript-text-color-custom-colors-wrapper')) {
      return;
    }
  }

  /**
   * {@inheritdoc}
   */
  public function submitConfigurationForm(array &$form, FormStateInterface $form_state): void {
    $values = $form_state->cleanValues()->getValues();
    $this->configuration['colors'] = $values['custom_colors_wrapper'] ?? [];
    $this->configuration['use_default_colors'] = $values['use_default_colors'] ?? TRUE;
  }

  /**
   * {@inheritdoc}
   */
  public function getDynamicPluginConfig(array $static_plugin_config, EditorInterface $editor): array {
    $textColors = $this->configuration['colors'];

    $useDefaultColors = $this->configuration['use_default_colors'];
    if (!empty($colors) && $useDefaultColors) {
      $defaultColors = $this->getDefaultColors();
      $textColors = array_merge($colors, $defaultColors);
    }
    // array_values() to make sure that we pass indexed array.
    if (!empty($textColors)) {
      $static_plugin_config['textcolor']['options'] = array_values($textColors);
    }

    return $static_plugin_config;
  }

  /**
   * Returns default values for the Font color plugin.
   *
   * @return array
   *   Array of colors.
   */
  private function getDefaultColors(): array {
    return [
      [
        'model' => 'yello',
        'class' => 'color-yellow',
        'title' => 'Yellow',
        'color' => '#f3cb41',
      ],
      [
        'model' => 'red',
        'class' => 'color-red',
        'title' => 'Red',
        'color' => 'red',
      ],
      [
        'model' => 'blue',
        'class' => 'color-blue',
        'title' => 'Blue',
        'color' => 'blue',
      ],
    ];
  }

}
