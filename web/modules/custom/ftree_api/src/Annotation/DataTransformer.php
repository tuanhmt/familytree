<?php

namespace Drupal\ftree_api\Annotation;

use Drupal\Component\Annotation\Plugin;

/**
 * Defines a Data Transformer item annotation object.
 *
 * @Annotation
 */
class DataTransformer extends Plugin {

  /**
   * The plugin ID.
   *
   * @var string
   */
  public $id;

  /**
   * The label of the plugin.
   *
   * @var \Drupal\Core\Annotation\Translation
   *
   * @ingroup plugin_translatable
   */
  public $label;

  /**
   * The entity type this transformer handles.
   *
   * @var string
   */
  public $entity_type;

  /**
   * The bundle this transformer handles.
   *
   * @var string
   */
  public $bundle;

}
