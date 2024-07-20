<?php

declare(strict_types=1);

namespace Drupal\church_node\EventSubscriber;

use Drupal\Core\Routing\RouteSubscriberBase;
use Symfony\Component\Routing\RouteCollection;

/**
 * Route subscriber.
 */
final class ChurchNodeRouteSubscriber extends RouteSubscriberBase {

  /**
   * {@inheritdoc}
   */
  protected function alterRoutes(RouteCollection $collection): void {
    if ($route = $collection->get('entity.node.canonical')) {
      $route->setRequirement('_node_premium_access', 'TRUE');
    }

    if ($route = $collection->get('entity.media.collection')) {
      $route->setRequirement('_permission', 'access media overview');
    }

    foreach ($this->getAllowedRoutes() as $route_name) {
      if ($route = $collection->get($route_name)) {
        $route->setRequirement('_node_premium_access', 'TRUE');
      }
    }
  }

  /**
   * {@inheritdoc}
   */
  protected function getAllowedRoutes(): array {
    return [
      'entity.node.canonical',
      'entity.media.canonical',
    ];
  }

}
