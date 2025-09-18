<?php

namespace Drupal\ftree_user\AccessControlHandler;

use Drupal\user\Entity\User;
use Drupal\user\UserInterface;
use Drupal\Core\Access\AccessResult;
use Drupal\Core\Session\AccountInterface;
use Drupal\user\UserAccessControlHandler as CoreUserAccessControlHandler;

class UserZoneAccessControlHandler extends CoreUserAccessControlHandler {

  public function checkAccess($entity, $operation, AccountInterface $account) {
    $parent_access = parent::checkAccess($entity, $operation, $account);
    if ($parent_access instanceof AccessResultForbidden) {
      return $parent_access;
    }

    if ($account->hasPermission('administer users')) {
      return $parent_access;
    }

    // Check the same person to allow edit own profile.
    if ($account->id() == $entity->id()) {
      return $parent_access;
    }

    // Only apply to permission manage users in own zone
    if ($account->hasPermission('administer users in own zone')) {
      // Only apply to User entity
      if ($entity instanceof UserInterface) {
        // Load user from current user
        $uid = $account->id();
        $user = User::load($uid);
        $manager_zone = $user->get('admin_zone')->target_id;
        /** @var \Drupal\user\UserInterface $entity */
        $user_zone = $entity->get('zone')->target_id;

        // Manager only edit user in own zone
        return AccessResult::forbiddenIf($manager_zone != $user_zone)
          ->cachePerUser()->addCacheableDependency($entity);
      }
    }

    return $parent_access;
  }
}