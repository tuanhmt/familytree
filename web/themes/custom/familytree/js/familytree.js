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
      $(window).scroll(function () {
        let windowTop = $(window).scrollTop();
        if (windowTop > 415) {
          $('.social-sharing-block').css('top', windowTop - 300);
        } else {
          $('.social-sharing-block').css('top', 0);
        }
      });
    }
  };

})(jQuery, Drupal, once);