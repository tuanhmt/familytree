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
  }

}
