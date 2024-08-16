<?php

namespace Drupal\ftree_core\Plugin\Menu;

use Drupal\user\Plugin\Menu\LoginLogoutMenuLink as BaseLoginLogoutMenuLink;

/**
 * A menu link that shows "Log in" or "Log out" as appropriate.
 */
class LoginLogoutMenuLink extends BaseLoginLogoutMenuLink {

  /**
   * {@inheritdoc}
   */
  public function getTitle() {
    if ($this->currentUser->isAuthenticated()) {
      return $this->t('Log out');
    }
    else {
      return $this->t('Member');
    }
  }

}
