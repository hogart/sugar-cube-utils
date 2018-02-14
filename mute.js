(function () {
    // requires menuButton.js
    //
    // Adds 'mute' toggle button to menu dock'

    'use strict';

    /* globals jQuery, storage, SugarCube, l10nStrings, scUtils */

    function handler() {
        document.documentElement.classList.toggle('mute');

        SugarCube.SimpleAudio.mute = !SugarCube.SimpleAudio.mute;
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

}());