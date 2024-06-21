<?php

namespace Drupal\church_ckeditor5\Plugin\EmbeddedContent;

use Drupal\Core\Template\Attribute;
use Drupal\Core\Form\FormStateInterface;
use Drupal\video_embed_field\ProviderManagerInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\ckeditor5_embedded_content\EmbeddedContentInterface;
use Drupal\ckeditor5_embedded_content\EmbeddedContentPluginBase;

/**
 * Renders a youtube iframe from input link.
 *
 * @EmbeddedContent(
 *   id = "youtube_frame",
 *   label = @Translation("Youtube"),
 * )
 */
class Youtube extends EmbeddedContentPluginBase implements EmbeddedContentInterface, ContainerFactoryPluginInterface {

  use StringTranslationTrait;

  const ID = 'youtube';

  /**
   * Constructs a Drupalist object.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param \Drupal\video_embed_field\ProviderManagerInterface $vef_plugin_manager
   *   The current_user.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    protected ProviderManagerInterface $vef_plugin_manager,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('video_embed_field.provider_manager')
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration() {
    return [
      'video_url' => NULL,
      'width' => 800,
      'height' => 425,
      'autoplay' => FALSE,
      'video_caption' => NULL,
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function getAttachments(): array {
    return [
      'library' => [
        'video_embed_field/responsive-video',
      ],
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $element = [];
    if (!empty($this->configuration['video_url'])) {
      $provider = $this->vef_plugin_manager->createInstance(static::ID, ['input' => $this->configuration['video_url']]);
      $element = $provider->renderEmbedCode(
        $this->configuration['width'],
        $this->configuration['height'],
        $this->configuration['autoplay']
      );
    }

    $attributes = [
      'class' => ['video-embed-field-responsive-video'],
    ];

    $build['youtube'] = [
      '#theme' => 'ckeditor5_embedded_youtube',
      '#attributes' => new Attribute($attributes),
      '#content' => $element,
      '#video_caption' => $this->configuration['video_caption'],
    ];

    return $build;
  }

  /**
   * {@inheritdoc}
   */
  public function buildConfigurationForm(array $form, FormStateInterface $form_state) {

    $form['video_url'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Youtube Url'),
      '#default_value' => $this->configuration['video_url'],
      '#required' => TRUE,
    ];

    $form['width'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Width'),
      '#default_value' => $this->configuration['width'],
      '#required' => TRUE,
    ];

    $form['height'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Height'),
      '#default_value' => $this->configuration['height'],
      '#required' => TRUE,
    ];

    $form['autoplay'] = [
      '#type' => 'checkbox',
      '#title' => $this->t('Is autoplay?'),
      '#default_value' => $this->configuration['autoplay'],
    ];

    $form['video_caption'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Video caption'),
      '#default_value' => $this->configuration['video_caption'],
    ];

    return $form;
  }

}
