<?php

declare(strict_types=1);

namespace Drupal\church_node\Access;

use Drupal\Core\Access\AccessResult;
use Drupal\node\NodeInterface;
use Symfony\Component\Routing\Route;
use Drupal\Core\Routing\CurrentRouteMatch;
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
    $node = $this->currentRouteMatch->getParameter('node');
    if ($node instanceof NodeInterface) {
      $is_premium = $node->hasField('field_is_premium') && (bool) $node->get('field_is_premium')->value;
      if ($is_premium) {
        return AccessResult::allowedIfHasPermission($this->currentUser, 'view premium content')
          ->cachePerPermissions()->cachePerUser()->addCacheableDependency($node)->addCacheContexts(['url']);
      }
    }
    return AccessResult::allowed();
  }

}
