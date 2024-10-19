<?php

namespace Drupal\ftree_api\Service;

use Drupal\Core\Plugin\DefaultPluginManager;
use Drupal\Core\Cache\CacheBackendInterface;
use Drupal\Core\Extension\ModuleHandlerInterface;
use Drupal\Core\Entity\EntityInterface;

/**
 * Provides a Data Transformer plugin manager.
 */
class DataTransformerManager extends DefaultPluginManager {

  /**
   * Constructs a new DataTransformerManager object.
   *
   * @param \Traversable $namespaces
   *   An object that implements \Traversable which contains the root paths
   *   keyed by the corresponding namespace to look for plugin implementations.
   * @param \Drupal\Core\Cache\CacheBackendInterface $cache_backend
   *   Cache backend instance to use.
   * @param \Drupal\Core\Extension\ModuleHandlerInterface $module_handler
   *   The module handler to invoke the alter hook with.
   */
  public function __construct(\Traversable $namespaces, CacheBackendInterface $cache_backend, ModuleHandlerInterface $module_handler) {
    parent::__construct(
      'Plugin/DataTransformer',
      $namespaces,
      $module_handler,
      'Drupal\ftree_api\Service\DataTransformerInterface',
      'Drupal\ftree_api\Annotation\DataTransformer'
    );

    $this->alterInfo('ftree_api_data_transformer_info');
    $this->setCacheBackend($cache_backend, 'ftree_api_data_transformer_plugins');
  }

  /**
   * Gets the appropriate data transformer for a given entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to transform.
   *
   * @return \Drupal\ftree_api\Service\DataTransformerInterface|null
   *   The data transformer plugin, or null.
   */
  public function getTransformer(EntityInterface $entity) {
    $definitions = $this->getDefinitions();
    foreach ($definitions as $plugin_id => $definition) {
      if ($definition['entity_type'] === $entity->getEntityTypeId() && $definition['bundle'] === $entity->bundle()) {
        return $this->createInstance($plugin_id);
      }
    }
    return NULL;
  }

}
