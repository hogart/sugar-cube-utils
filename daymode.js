(function () {
    // see daymode.css
    //
    // requires menuButton.js
    //
    // Adds 'day/night mode toggle button to menu dock'

    'use strict';

    /* globals storage, State, jQuery, l10nStrings, scUtils */

    const $html = jQuery('html');

    let isOn;

    if (storage.has('dayMode')) {
        isOn = storage.get('dayMode');
    } else if ('dayMode' in State.variables) {
        isOn = State.variables.dayMode;
    }

    function handler() {
        $html.toggleClass('daymode');
        isOn = !isOn;
        storage.set('dayMode', isOn);
    }

    if (isOn) {
        $html.addClass('daymode');
    }

    scUtils.createHandlerButton(l10nStrings.uiBarNightMode || 'Day mode', '', 'skin', handler);
}());