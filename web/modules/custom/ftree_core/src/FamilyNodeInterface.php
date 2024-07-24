<?php

declare(strict_types=1);

namespace Drupal\ftree_core;

use Drupal\Core\Entity\ContentEntityInterface;
use Drupal\user\EntityOwnerInterface;

/**
 * Provides an interface defining a family node entity type.
 */
interface FamilyNodeInterface extends ContentEntityInterface, EntityOwnerInterface {

}
