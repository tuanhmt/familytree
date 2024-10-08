<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Access;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\Core\Entity\EntityTypeInterface;
use Drupal\Core\Messenger\MessengerInterface;
use Drupal\Core\Entity\EntityHandlerInterface;
use Drupal\Core\Entity\EntityAccessControlHandler;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Access controller for the family_node entity.
 */
class FamilyNodeAccessControlHandler extends EntityAccessControlHandler implements EntityHandlerInterface {

  /**
   * The messenger service.
   *
   * @var \Drupal\Core\Messenger\MessengerInterface
   */
  protected $messenger;

  /**
   * {@inheritdoc}
   */
  public static function createInstance(ContainerInterface $container, EntityTypeInterface $entity_type) {
    return new static(
      $entity_type,
      $container->get('messenger')
    );
  }

  /**
   * Constructs the custom access control handler instance.
   *
   * @param \Drupal\Core\Entity\EntityTypeInterface $entity_type
   *   The entity type definition.
   * @param \Drupal\Core\Messenger\MessengerInterface $messenger
   *   The messenger service.
   */
  public function __construct(EntityTypeInterface $entity_type, MessengerInterface $messenger) {
    parent::__construct($entity_type);
    $this->messenger = $messenger;
  }

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $entity, $operation, AccountInterface $account) {
    if ($operation === 'delete' && $entity->getEntityTypeId() === 'family_node') {
      // Check if other family_node entities reference this entity.
      $referencing_entities = _ftree_core_get_referencing_entities($entity);
      if (!empty($referencing_entities)) {
        return AccessResult::forbidden();
      }
    }

    // Call the parent method for other operations.
    return parent::checkAccess($entity, $operation, $account);
  }

}
