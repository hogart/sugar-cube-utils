(function () {
    // see daymode.css
    'use strict';

    const $html = $('html');
    const template = `<li id="menu-item-skin"><a>${l10nStrings.uiBarNightMode || 'Day mode'}</a></li>`;

    let isOn;

    if (storage.has('dayMode')) {
        isOn = storage.get('dayMode');
    } else if ('dayMode' in State.variables) {
        isOn = State.variables.dayMode;
    }

    const $button = jQuery(template)
        .ariaClick(() => {
            $html.toggleClass('daymode');
            isOn = !isOn;
            storage.set('dayMode', isOn);
        });

    $button.appendTo('#menu-core');

    if (isOn) {
        $html.addClass('daymode');
    }
}());