<?php

namespace Drupal\ftree_api\Plugin\DataTransformer;

use Drupal\Core\Entity\EntityInterface;
use Drupal\ftree_core\FamilyNodeInterface;
use Drupal\ftree_api\DTO\FamilyNodeDTO;
use Drupal\ftree_api\Service\DataTransformerInterface;
use Drupal\file\FileInterface;

/**
 * Define a new data transformer for family node.
 *
 * @DataTransformer(
 *   id = "family_node_transformer",
 *   label = @Translation("Family Node Transformer"),
 *   entity_type = "node",
 *   bundle = "family_node"
 * )
 */
class FamilyNodeTransformer implements DataTransformerInterface {

  /**
   * {@inheritDoc}
   */
  public static function transform(EntityInterface $entity): FamilyNodeDTO {
    if (!$entity instanceof FamilyNodeInterface || $entity->getEntityTypeId() !== 'family_node') {
      throw new \InvalidArgumentException('Invalid entity type or bundle');
    }

    return new FamilyNodeDTO([
      'id' => $entity->id(),
      'fullName' => $entity->get('fullname')->value,
      // 'nickName' => $entity->get('nickname')->value,
      // 'saintName' => $entity->get('saintname')->value,
      'gender' => $entity->get('gender')->value,
      // 'fatherName' => $entity->get('fathername')->value,
      // 'motherName' => $entity->get('mothername')->value,
      // 'livingAddress' => $entity->get('livingaddress')->value,
      // 'phone' => $entity->get('phone')->value,
      // 'email' => $entity->get('email')->value,
      'avatar' => $entity->get('avatar')->entity instanceof FileInterface
        ? $entity->get('avatar')->entity->createFileUrl()
        : NULL,
    ]);
  }

}
