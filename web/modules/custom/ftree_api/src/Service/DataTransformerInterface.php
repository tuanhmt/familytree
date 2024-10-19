<?php

namespace Drupal\ftree_api\Service;

use Drupal\Core\Entity\EntityInterface;

/**
 * Interface for data transformers.
 */
interface DataTransformerInterface {

  /**
   * Transform the entity.
   *
   * @param \Drupal\Core\Entity\EntityInterface $entity
   *   The entity to transform.
   *
   * @return array
   *   The transformed entity.
   */
  public static function transform(EntityInterface $entity);

}
