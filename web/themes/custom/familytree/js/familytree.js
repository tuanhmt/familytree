/**
 * @file
 * The script for Church theme.
 */

(function ($, Drupal, once) {
  'use strict';

  /**
   * Init newstiker behavior.
   *
   * @type {{attach: Drupal.behaviors.initNewsTicker}}
   */
  Drupal.behaviors.initNewsTicker = {
    attach: function attach(context) {
      $(once('initNewsTicker', '.ticker', context)).each(function () {
        $(this).ticker();
      });
    }
  };

  /**
   * Init social button behavior.
   *
   * @type {{attach: Drupal.behaviors.socialButtons}}
   */
  Drupal.behaviors.socialButtons = {
    attach: function attach(context) {
      let artical_title = $('.article-title');
      if (artical_title.length) {
        let targetOffset = artical_title.offset().top;
        $(window).scroll(function () {
          let windowTop = $(window).scrollTop();
          console.log(windowTop);
          if (windowTop > targetOffset - 50) {
            $('.social-sharing-block').css('top', windowTop - 350);
          } else {
            $('.social-sharing-block').css('top', 0);
          }
        });
      }
    }
  };

  /**
   * Init stickyContent behavior.
   *
   * @type {{attach: Drupal.behaviors.stickyContent}}
   */
  Drupal.behaviors.stickyContent = {
    attach: function attach(context) {
      var targetOffset = $('.main-section').offset().top;
      $(window).scroll(function () {
        let windowTop = $(window).scrollTop();
        if (windowTop > targetOffset - 50) {
          $('.main-sticky-left').css('top', windowTop - 300);
          $('.main-sticky-right').css('top', windowTop - 300);
        } else {
          $('.main-sticky-left').css('top', 0);
          $('.main-sticky-right').css('top', 0);
        }
      });
    }
  };

})(jQuery, Drupal, once);