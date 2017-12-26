/* globals jQuery, SugarCube, l10nStrings, scUtils */
(function (SugarCube) {
    // requires menuButton.js
    //
    // Adds 'mute' toggle button to menu dock'

    'use strict';

    const {SimpleAudio} = SugarCube;

    const $html = jQuery('html');

    function handler() {
        $html.toggleClass('mute');

        SimpleAudio.mute = !SimpleAudio.mute;
    }

    const { style } = scUtils.createHandlerButton(l10nStrings.uiBarMute || 'Sound', '\\e843\\00a0', 'mute', handler);
    const styleId = style.attr('id').replace(/-style$/, '');

    style.text(`
        #menu-core #${styleId} a::before {
            content: '\\e843\\00a0';
        }
        .mute #menu-core #${styleId} a::before {
            content: '\\e842\\00a0';
        }
    `);

}(SugarCube.SimpleAudio ? SugarCube : {SimpleAudio}));