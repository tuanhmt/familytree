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

    $data = [
      [
        "id" => "dyTpfj6sr",
        "gender" => "male",
        "spouses" => [
          [
            "id" => "dyTpfj6ss",
            "type" => "married",
          ],
        ],
        "siblings" => [],
        "parents" => [],
        "children" => [
          [
            "id" => "ahfR5lR2s",
            "type" => "blood",
          ],
        ],
      ],
      [
        "id" => "dyTpfj6ss",
        "gender" => "female",
        "spouses" => [
          [
            "id" => "dyTpfj6sr",
            "type" => "married",
          ],
        ],
        "siblings" => [],
        "parents" => [],
        "children" => [
          [
            "id" => "ahfR5lR2s",
            "type" => "blood",
          ],
        ],
      ],
      [
        "id" => "ahfR5lR2s",
        "gender" => "female",
        "spouses" => [],
        "siblings" => [],
        "parents" => [
          [
            "id" => "dyTpfj6sr",
            "type" => "blood",
          ],
        ],
        "children" => [],
      ],
    ];

    $build['#attached']['drupalSettings']['ftree_nodes'] = $data;
    return $build;
  }

}
