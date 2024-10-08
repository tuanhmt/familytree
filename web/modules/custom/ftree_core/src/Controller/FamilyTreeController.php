<?php

declare(strict_types=1);

namespace Drupal\ftree_core\Controller;

use Drupal\Core\Cache\CacheableMetadata;
use Drupal\Core\Controller\ControllerBase;
use Drupal\Core\File\FileUrlGeneratorInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Returns responses for Ftree core routes.
 */
final class FamilyTreeController extends ControllerBase {

  /**
   * Entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */

  protected $entityTypeManager;

  /**
   * File url generator object.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

  /**
   * Constructs new PhotoswipePreprocessProcessor object.
   *
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entityTypeManager
   *   Entity manager.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $fileUrlGenerator
   *   File url generator object.
   */
  public function __construct(EntityTypeManagerInterface $entityTypeManager, FileUrlGeneratorInterface $fileUrlGenerator) {
    $this->entityTypeManager = $entityTypeManager;
    $this->fileUrlGenerator = $fileUrlGenerator;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container) {
    return new static(
      $container->get('entity_type.manager'),
      $container->get('file_url_generator')
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
        "fullname" => $family_node->get('fullname')?->value,
        "birth_year" => $family_node->get('birth_year')?->value,
        "death_year" => $family_node->get('death_year')?->value ?? '',
        "order" => $family_node->get('order')?->value ?? '',
      ];
      foreach ($relation_types as $type) {
        $node_data[$type] = [];
        $relations = $family_node->get($type)->getValue();
        foreach ($relations as $relation) {
          $node_data[$type][] = [
            'id' => $relation["target_id"],
            'type' => $relation["relationship_type"],
          ];
          switch ($type) {
            case 'spouses':
              $data[(int) $relation["target_id"]]['spouses'][] = [
                'id' => $family_node->id(),
                'type' => $relation["relationship_type"],
              ];
              break;

            case 'parents':
              $data[(int) $relation["target_id"]]['children'][] = [
                'id' => $family_node->id(),
                'type' => $relation["relationship_type"],
              ];
              break;

            default:
              break;
          }
        }
      }

      $image = $family_node->avatar->entity;

      if (!is_null($image)) {
        $file_uri = $image->getFileUri();
        $image_url = $this->fileUrlGenerator->generateString($file_uri);
        $node_data['avatar'] = $image_url;
      }

      // Add to data collector.
      $data[$family_node->id()] = isset($data[$family_node->id()]) ? array_merge_recursive($data[$family_node->id()], $node_data) : $node_data;
    }

    $build['#attached']['drupalSettings']['ftree_nodes'] = array_values(array: $data);
    $build['#cache'] = [
      'tags' => ['family_node_list'],
    ];

    // Apply cache metadata to the render array.
    $cache_metadata = new CacheableMetadata();
    // Attach a cache tag that is invalidated
    // when nodes of this content type are added, updated, or deleted.
    $cache_metadata->setCacheTags(['family_node_list']);
    // Apply cache metadata.
    $cache_metadata->applyTo($data);

    return $build;
  }

}
