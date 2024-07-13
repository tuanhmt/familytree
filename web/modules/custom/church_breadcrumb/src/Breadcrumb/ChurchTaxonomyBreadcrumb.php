<?php

declare(strict_types=1);

namespace Drupal\church_breadcrumb\Breadcrumb;

use Drupal\Core\Link;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\taxonomy\Entity\Term;
use Drupal\taxonomy\TermInterface;

/**
 * Add description for this breadcrumb builder.
 */
final class ChurchTaxonomyBreadcrumb implements BreadcrumbBuilderInterface {

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
    return $route_match->getRouteName() == "entity.taxonomy_term.canonical"
    && $route_match->getParameter('taxonomy_term') instanceof Term;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match): Breadcrumb {
    $breadcrumb = new Breadcrumb();
    $links[] = Link::createFromRoute($this->t('Home'), '<front>');
    $parameters = $route_match->getParameters()->all();
    if (isset($parameters['taxonomy_term'])) {
      $term = $route_match->getParameter('taxonomy_term');
      $breadcrumb->addCacheContexts(["url"]);
      $breadcrumb->addCacheTags(["taxonomy_term:{$term->id()}"]);

      // Add node title.
      $links[] = Link::createFromRoute($term->label(), '<none>');
    }

    return $breadcrumb->setLinks($links);
  }

}
