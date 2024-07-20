<?php

declare(strict_types=1);

namespace Drupal\church_breadcrumb\Breadcrumb;

use Drupal\Core\Link;
use Drupal\Core\Breadcrumb\Breadcrumb;
use Drupal\Core\Routing\RouteMatchInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Drupal\Core\Breadcrumb\BreadcrumbBuilderInterface;
use Drupal\Core\StringTranslation\StringTranslationTrait;
use Drupal\media\Entity\Media;

/**
 * Add description for this breadcrumb builder.
 */
final class ChurchMediaBreadcrumb implements BreadcrumbBuilderInterface {

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
    return $route_match->getRouteName() == "entity.media.canonical"
    && $route_match->getParameter('media') instanceof Media;
  }

  /**
   * {@inheritdoc}
   */
  public function build(RouteMatchInterface $route_match): Breadcrumb {
    $breadcrumb = new Breadcrumb();
    $links[] = Link::createFromRoute($this->t('Home'), '<front>');
    $parameters = $route_match->getParameters()->all();
    if (isset($parameters['media'])) {
      $media = $parameters['media'];
      $breadcrumb->addCacheContexts(["url"]);
      $breadcrumb->addCacheTags(["media:{$media->id()}"]);

      if ($media->bundle() == 'album') {
        $links[] = Link::createFromRoute($this->t('Galleries'), 'view.galleries.galleries');
      }

      // Add media title.
      $links[] = Link::createFromRoute($media->label(), '<none>');
    }

    return $breadcrumb->setLinks($links);
  }

}
