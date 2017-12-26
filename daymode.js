/* globals SugarCube, jQuery, l10nStrings, scUtils */
(function (SugarCube) {
    // see daymode.css
    //
    // requires menuButton.js
    //
    // Adds 'day/night mode toggle button to menu dock'

    'use strict';

    const {storage, State} = SugarCube;

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
}(SugarCube.storage ? SugarCube : {storage, State}));