<?php

declare(strict_types=1);

namespace Drupal\ftree_block\Plugin\Block;

use Drupal\Core\Block\BlockBase;
use Drupal\Core\Form\FormStateInterface;
use Drupal\Core\Plugin\ContainerFactoryPluginInterface;
use Drupal\Core\Session\AccountProxyInterface;
use Symfony\Component\DependencyInjection\ContainerInterface;

/**
 * Provides a card overlay block block.
 *
 * @Block(
 *   id = "card_overlay_block",
 *   admin_label = @Translation("Card Overlay Block"),
 *   category = @Translation("ftree"),
 * )
 */
final class CardOverlayBlock extends BlockBase implements ContainerFactoryPluginInterface {

  /**
   * Constructs the plugin instance.
   */
  public function __construct(
    array $configuration,
    $plugin_id,
    $plugin_definition,
    private readonly AccountProxyInterface $currentUser,
  ) {
    parent::__construct($configuration, $plugin_id, $plugin_definition);
  }

  /**
   * {@inheritdoc}
   */
  public static function create(ContainerInterface $container, array $configuration, $plugin_id, $plugin_definition): self {
    return new self(
      $configuration,
      $plugin_id,
      $plugin_definition,
      $container->get('current_user'),
    );
  }

  /**
   * {@inheritdoc}
   */
  public function defaultConfiguration(): array {
    return [
      'card_image' => '/themes/custom/familytree/images/ftree_bg.png',
      'card_header' => $this->t('Online family tree'),
      'card_text' => $this->t('Place to save the online family tree'),
      'card_link' => '/family-tree',
    ];
  }

  /**
   * {@inheritdoc}
   */
  public function blockForm($form, FormStateInterface $form_state): array {
    $form['card_image'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Card Image'),
      '#default_value' => $this->configuration['card_image'],
    ];
    $form['card_header'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Card Header'),
      '#default_value' => $this->configuration['card_header'],
    ];
    $form['card_text'] = [
      '#type' => 'textarea',
      '#title' => $this->t('Card Text'),
      '#default_value' => $this->configuration['card_text'],
    ];
    $form['card_link'] = [
      '#type' => 'textfield',
      '#title' => $this->t('Card Link'),
      '#default_value' => $this->configuration['card_link'],
    ];
    return $form;
  }

  /**
   * {@inheritdoc}
   */
  public function blockSubmit($form, FormStateInterface $form_state): void {
    $this->configuration['card_image'] = $form_state->getValue('card_image');
    $this->configuration['card_header'] = $form_state->getValue('card_header');
    $this->configuration['card_text'] = $form_state->getValue('card_text');
    $this->configuration['card_link'] = $form_state->getValue('card_link');
  }

  /**
   * {@inheritdoc}
   */
  public function build(): array {
    $build['content'] = [
      '#theme' => 'card_overlay_block',
      '#card_image' => $this->configuration['card_image'],
      '#card_header' => $this->configuration['card_header'],
      '#card_text' => $this->configuration['card_text'],
      '#card_link' => $this->configuration['card_link'],
    ];
    return $build;
  }

}
