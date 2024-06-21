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

})(jQuery, Drupal, once);