<?php

namespace Drupal\ftree_api\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Symfony\Component\HttpKernel\Exception\BadRequestHttpException;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\HttpFoundation\RequestStack;
use Psr\Log\LoggerInterface;
use Drupal\ftree_core\Entity\FamilyNode;
use Drupal\Core\File\FileUrlGeneratorInterface;

/**
 * Provides a REST resource for family nodes with filtering.
 *
 * @RestResource(
 *   id = "family_nodes_resource",
 *   label = @Translation("Family Nodes Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v1.0/family-nodes"
 *   }
 * )
 */
class FamilyNodesResource extends ResourceBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The request stack.
   *
   * @var \Symfony\Component\HttpFoundation\RequestStack
   */
  protected $requestStack;

  /**
   * The file URL generator.
   *
   * @var \Drupal\Core\File\FileUrlGeneratorInterface
   */
  protected $fileUrlGenerator;

  /**
   * Constructs a new FamilyNodesResource instance.
   *
   * @param array $configuration
   *   A configuration array containing information about the plugin instance.
   * @param string $plugin_id
   *   The plugin_id for the plugin instance.
   * @param mixed $plugin_definition
   *   The plugin implementation definition.
   * @param array $serializer_formats
   *   The available serialization formats.
   * @param \Psr\Log\LoggerInterface $logger
   *   A logger instance.
   * @param \Drupal\Core\Entity\EntityTypeManagerInterface $entity_type_manager
   *   The entity type manager.
   * @param \Symfony\Component\HttpFoundation\RequestStack $request_stack
   *   The request stack.
   * @param \Drupal\Core\File\FileUrlGeneratorInterface $file_url_generator
   *   The file URL generator.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityTypeManagerInterface $entity_type_manager,
    RequestStack $request_stack,
    FileUrlGeneratorInterface $file_url_generator
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->entityTypeManager = $entity_type_manager;
    $this->requestStack = $request_stack;
    $this->fileUrlGenerator = $file_url_generator;
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition) {
    return new static(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->getParameter('serializer.formats'),
      $container->get('logger.factory')->get('ftree_api'),
      $container->get('entity_type.manager'),
      $container->get('request_stack'),
      $container->get('file_url_generator')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The response containing the family nodes.
   */
  public function get() {
    $filter_id = $this->requestStack->getCurrentRequest()->query->get('filter', 'all');

    try {
      $query = $this->entityTypeManager->getStorage('family_node')->getQuery();
      $query->accessCheck(TRUE);

      switch ($filter_id) {
        case 'blood':
          // $query->condition('type', 'blood');
          break;

        case 'all':
        default:
          break;
      }

      $nids = $query->execute();
      /** @var \Drupal\ftree_core\Entity\FamilyNode[] $nodes */
      $family_nodes = $this->entityTypeManager->getStorage('family_node')->loadMultiple($nids);
      $data = [];
      $relation_types = ["spouses", "siblings", "parents", "children"];
      foreach ($family_nodes as $family_node) {
        $node_data = [
          "id" => $family_node->id(),
          "gender" => $family_node->get('gender')?->value,
          "fullname" => $family_node->get('fullname')?->value,
          "birth_year" => $family_node->get('birth_year')?->value ?? '',
          "death_year" => $family_node->get('death_year')?->value ?? '',
          "order" => $family_node->get('order')?->value ?? '',
          "generation" => $family_node->get('generation')?->value ?? '',
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

        if ($image !== NULL) {
          $file_uri = $image->getFileUri();
          $image_url = $this->fileUrlGenerator->generateString($file_uri);
          $node_data['avatar'] = $image_url;
        }

        // Add to data collector.
        $data[$family_node->id()] = isset($data[$family_node->id()]) ? array_merge_recursive($data[$family_node->id()], $node_data) : $node_data;
      }

      $response_data = [];
      foreach ($nodes as $node) {
        $response_data[] = [
          'id' => $node->id(),
          'gender' => $node->get('gender')->value,
          'fullname' => $node->get('fullname')->value,
          'birth_year' => $node->get('birth_year')->value,
          'death_year' => $node->get('death_year')->value,
          'order' => $node->get('order')->value,
          'spouses' => $this->getRelatedNodes($node, 'spouses'),
          'siblings' => $this->getRelatedNodes($node, 'siblings'),
          'parents' => $this->getRelatedNodes($node, 'parents'),
          'children' => $this->getRelatedNodes($node, 'children'),
        ];
      }

      return new ResourceResponse($response_data);
    }
    catch (\Exception $e) {
      throw new BadRequestHttpException($e->getMessage());
    }
  }

  /**
   * Helper method to get related nodes.
   *
   * @param \Drupal\ftree_core\Entity\FamilyNode $node
   *   The family node entity.
   * @param string $field_name
   *   The field name to get related nodes from.
   *
   * @return array
   *   Array of related node data.
   */
  protected function getRelatedNodes(FamilyNode $node, $field_name) {
    $related = [];
    if ($node->hasField($field_name)) {
      foreach ($node->get($field_name) as $item) {
        if ($item->entity) {
          $related[] = [
            'id' => $item->entity->id(),
            'type' => $item->type ?? 'blood',
          ];
        }
      }
    }
    return $related;
  }

}
