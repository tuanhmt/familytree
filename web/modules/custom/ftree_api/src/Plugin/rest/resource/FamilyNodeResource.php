<?php

namespace Drupal\ftree_api\Plugin\rest\resource;

use Drupal\rest\Plugin\ResourceBase;
use Drupal\rest\ResourceResponse;
use Psr\Log\LoggerInterface;
use Drupal\Core\Entity\EntityTypeManagerInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;
use Drupal\ftree_api\Plugin\DataTransformer\FamilyNodeTransformer;

/**
 * Provides a resource to get Family Node data.
 *
 * @RestResource(
 *   id = "family_node_resource",
 *   label = @Translation("Family Node Resource"),
 *   uri_paths = {
 *     "canonical" = "/api/v1.0/family-node/{id}"
 *   }
 * )
 */
class FamilyNodeResource extends ResourceBase {

  /**
   * The entity type manager.
   *
   * @var \Drupal\Core\Entity\EntityTypeManagerInterface
   */
  protected $entityTypeManager;

  /**
   * The family node transformer.
   *
   * @var \Drupal\ftree_api\Plugin\DataTransformer\FamilyNodeTransformer
   */
  protected $familyNodeTransformer;

  /**
   * Constructs a new FamilyNodeResource object.
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
   * @param \Drupal\ftree_api\Plugin\DataTransformer\FamilyNodeTransformer $family_node_transformer
   *   The family node transformer.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    array $serializer_formats,
    LoggerInterface $logger,
    EntityTypeManagerInterface $entity_type_manager,
    FamilyNodeTransformer $family_node_transformer
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition, $serializer_formats, $logger);
    $this->entityTypeManager = $entity_type_manager;
    $this->familyNodeTransformer = $family_node_transformer;
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
      $container->get('ftree_api.family_node_transformer')
    );
  }

  /**
   * Responds to GET requests.
   *
   * @param int $id
   *   The ID of the family node.
   *
   * @return \Drupal\rest\ResourceResponse
   *   The HTTP response object.
   *
   * @throws \Symfony\Component\HttpKernel\Exception\HttpException
   */
  public function get($id) {
    $node_storage = $this->entityTypeManager->getStorage('family_node');
    $node = $node_storage->load($id);

    if (!$node || $node->getEntityTypeId() !== 'family_node') {
      return new ResourceResponse(['error' => 'Family node not found'], 404);
    }

    // Transform the family node to DTO.
    $data = $this->familyNodeTransformer->transform($node);

    $response = new ResourceResponse($data);
    $response->addCacheableDependency($node);
    return $response;
  }

}
