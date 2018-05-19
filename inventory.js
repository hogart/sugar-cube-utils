(function () {
    'use strict';

    /* globals jQuery */
    // requires onPassagePresent.js

    // Utility functions to manage inventory appearance.
    // Inventory is displayed as PassageHeader (or PassageFooter) and consists of button that opens
    // some kind of overlay. This button should have `js-toggleInventory` class. Overlay should have
    // `js-inventory` class and open by assigning `open` class.

    const $body = jQuery('body');

    $body.on('click', '.js-toggleInventory', function (event) {
        jQuery(event.target)
            .closest('.js-inventory') // we need to get this element every time
            .toggleClass('open');
    });

    function pingInventory(className, timeout) {
        $body.addClass(className);
        setTimeout(() => {
            $body.removeClass(className);
        }, timeout);
    }

    function hiliteInventory(className = 'ping-inventory', timeout = 3500) {
        window.scUtils.onPassagePresent(() => pingInventory(className, timeout));
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            pingInventory,
            hiliteInventory,
        }
    );
}());