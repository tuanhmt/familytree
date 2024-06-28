<?php

declare(strict_types=1);

namespace Drupal\church_breadcrumb;

use Drupal\Core\Link;
use Drupal\node\NodeInterface;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Add description for this breadcrumb builder.
 */
final class ChurchContentBreadcrumb implements BreadcrumbBuilderInterface {

  use StringTranslationTrait;

  /**
   * Constructs a ChurchBreadcrumb object.
   */
  public function __construct(
    private readonly AccountProxyInterface $currentUser,
  ) {}

  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match): bool {
    return $route_match->getRouteName() == 'entity.node.canonical'
    && $route_match->getParameter('node') instanceof NodeInterface;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match): Breadcrumb {
    $node = $route_match->getParameter('node');
    $breadcrumb = new Breadcrumb();

    $breadcrumb->addCacheContexts(["url"]);
    // The cache is invalidated when the node is edited.
    $breadcrumb->addCacheTags(["node:{$node->nid->value}"]);

    $links[] = Link::createFromRoute($this->t('Home'), '<front>');
    // Add that term as a breadcrumb link.
    if (!empty($node->field_category->entity)) {
      $links[] = $node->field_category->entity->toLink();
    }
    // Add node title.
    $links[] = Link::createFromRoute($node->label(), '<none>');

    return $breadcrumb->setLinks($links);
  }

}
