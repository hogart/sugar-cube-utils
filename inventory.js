(function inventoryUtil() {
    'use strict';

    // requires onPassagePresent.js

    // Utility functions to manage inventory appearance.
    // Inventory is displayed as PassageHeader (or PassageFooter) and consists of button that opens
    // some kind of overlay. This button should have `js-toggleInventory` class. Overlay should have
    // `js-inventory` class and open by assigning `open` class.

    const $body = jQuery('body');
    const $doc = jQuery(document);

    const inventory = {
        pingTimeout: 3500, // depends on how long animation is
        beaconInterval: 4000,
        pingClassName: 'ping-inventory',

        setup({pingTimeout = this.pingTimeout, beaconInterval = this.beaconInterval, pingClassName = this.pingClassName} = {}) {
            Object.assign(this, {
                pingTimeout,
                beaconInterval,
                pingClassName,
            });
        },

        onInventoryClick(event) {
            jQuery(event.target)
                .closest('.js-inventory') // we need to get this element every time
                .toggleClass('open');
        },

        ping(className, timeout) {
            $body.addClass(className);
            setTimeout(() => {
                $body.removeClass(className);
            }, timeout);
        },

        hilite({className = this.pingClassName, timeout = this.pingTimeout} = {}) {
            window.scUtils.onPassagePresent(() => {
                this.ping(className, timeout);
            });
        },

        beacon({className = this.pingClassName, timeout = this.pingTimeout, interval = this.beaconInterval} = {}) {
            const intervalId = setInterval(() => {
                this.hilite({className, timeout});
            }, interval);

            // stop beaconing when moved to another passage
            $doc.on(':passagestart', () => {
                clearInterval(intervalId);
            });

            return intervalId;
        },
    };

    $body.on('click', '.js-toggleInventory', inventory.onInventoryClick);

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            inventory,
        }
    );
}());