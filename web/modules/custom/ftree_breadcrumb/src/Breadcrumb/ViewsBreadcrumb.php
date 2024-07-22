<?php

declare(strict_types=1);

namespace Drupal\ftree_breadcrumb\Breadcrumb;

use Drupal\Core\Link;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;

/**
 * Add description for this breadcrumb builder.
 */
final class ViewsBreadcrumb implements BreadcrumbBuilderInterface {

  use StringTranslationTrait;

  /**
   * Constructs a FTreeBreadcrumb object.
   */
  public function __construct(
    private readonly AccountProxyInterface $currentUser,
  ) {
  }

  /**
   * {@inheritdoc}
   */
  public function applies(RouteMatchInterface $route_match): bool {
    $parameters = $route_match->getParameters()->all();
    if (isset($parameters['view_id'])) {
      if (in_array($parameters['view_id'], $this->getAllowedViewsIds())) {
        return TRUE;
      }
    }

    return FALSE;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match): Breadcrumb {
    $breadcrumb = new Breadcrumb();
    $links[] = Link::createFromRoute($this->t('Home'), '<front>');
    $breadcrumb->addCacheContexts(["url"]);
    $parameters = $route_match->getParameters()->all();
    if (isset($parameters['view_id'])) {
      switch ($parameters['view_id']) {
        case 'galleries':
          $links[] = Link::createFromRoute($this->t('Galleries'), '<none>');
          break;

        default:
          break;
      }
      $breadcrumb->addCacheTags(["view_id:{$parameters['view_id']}"]);
    }

    return $breadcrumb->setLinks($links);
  }

  /**
   * {@inheritdoc}
   */
  public function getAllowedViewsIds() {
    return [
      'galleries',
    ];
  }

}
