<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Controller;

use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns responses for Ftree core routes.
 */
final class FamilyTreeController extends ControllerBase {

  /**
   * {@inheritdoc}
   */
  protected $entityTypeManager;

  /**
   * {@inheritdoc}
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager) {
    $this->entityTypeManager = $entityTypeManager;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager')
    );
  }

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

    $nodeStorage = $this->entityTypeManager()->getStorage('family_node');

    $ids = $nodeStorage->getQuery()
      ->accessCheck(TRUE)
      ->execute();

    $family_nodes = $nodeStorage->loadMultiple($ids);
    $data = [];
    $relation_types = ["spouses", "siblings", "parents", "children"];
    foreach ($family_nodes as $family_node) {
      $node_data = [
        "id" => $family_node->id(),
        "gender" => $family_node->get('gender')?->value,
      ];
      foreach ($relation_types as $type) {
        $node_data[$type] = [];
        $relations = $family_node->get($type)->getValue();
        foreach ($relations as $relation) {
          $node_data[$type][] = [
            'id' => $relation["target_id"],
            'type' => $relation["relationship_type"],
          ];
        }
      }

      // Add to data collector.
      $data[] = $node_data;
    }

    $build['#attached']['drupalSettings']['ftree_nodes'] = $data;
    return $build;
  }

}
