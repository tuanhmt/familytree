<?php

declare(strict_types=1);

namespace Drupal\church_node\Access;

use Drupal\Core\Access\AccessResult;
use Symfony\Component\Routing\Route;
use Drupal\Core\Routing\CurrentRouteMatch;
use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Routing\Access\AccessInterface;

/**
 * Checks if passed parameter matches the route configuration.
 */
final class NodePremiumAccessChecker implements AccessInterface {

  /**
   * Constructs a NodePremiumAccessChecker object.
   */
  public function __construct(
    private readonly AccountProxyInterface $currentUser,
    private readonly CurrentRouteMatch $currentRouteMatch,
  ) {}

  /**
   * Access callback.
   */
  public function access(Route $route): AccessResult {
    $entity_types = array_keys($route->getOption('parameters'));
    foreach ($entity_types as $entity_type) {
      $entity = $this->currentRouteMatch->getParameter($entity_type);
      if ($entity instanceof ContentEntityInterface) {
        $is_premium = $entity->hasField('field_is_premium') && (bool) $entity->get('field_is_premium')->value;
        if ($is_premium) {
          return AccessResult::allowedIfHasPermission($this->currentUser, 'view premium content')
            ->cachePerPermissions()->cachePerUser()->addCacheableDependency($entity)->addCacheContexts(['url']);
        }
      }
    }

    return AccessResult::allowed();
  }

}
