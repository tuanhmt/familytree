<?php

declare(strict_types=1);

namespace Drupal\church_node\Access;

use Drupal\Core\Access\AccessResult;
use Drupal\Core\Access\AccessResultForbidden;
use Drupal\Core\Entity\EntityInterface;
use Drupal\Core\Session\AccountInterface;
use Drupal\node\NodeAccessControlHandler;

/**
 * Defines the custom access control handler for the node entity field value.
 */
class PremiumContentAccessControlHandler extends NodeAccessControlHandler {

  /**
   * {@inheritdoc}
   */
  protected function checkAccess(EntityInterface $node, $operation, AccountInterface $account) {
    /** @var \Drupal\node\NodeInterface $node */
    $access_result = parent::checkAccess($node, $operation, $account);
    if (!($access_result instanceof AccessResultForbidden)) {
      $is_premium = $node->hasField('field_is_premium') && (bool) $node->get('field_is_premium')->getValue();
      if ($is_premium) {
        $access_result = AccessResult::allowedIfHasPermission($account, 'view premium content')
          ->cachePerPermissions()->cachePerUser()->addCacheableDependency($node);
      }
    }
    return $access_result;
  }

}
