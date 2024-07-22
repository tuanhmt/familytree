<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Controller;

use Drupal\Core\Controller\ControllerBase;

/**
 * Returns responses for Ftree core routes.
 */
final class FamilyTreeController extends ControllerBase {

  /**
   * Builds the response.
   */
  public function __invoke(): array {

    $build['content'] = [
      '#markup' => '<div id="root"></div>',
    ];

    $build['#attached'] = [
      'library' => [
        'ftree_core/ftree_app',
      ],
    ];

    return $build;
  }

}
