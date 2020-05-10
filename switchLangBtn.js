(function () {
    'use strict';

    // requires menuButton.js

    /* globals scUtils */

    function createLangButton(label, langCode) {
        scUtils.createHandlerButton(label, '', 'lang', () => {
            const prefix = langCode ? '-' + langCode : '';
            const url = `./index${prefix}.html`;
            window.location.replace(url);
        });
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            createLangButton,
        }
    );
}());