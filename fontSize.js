(function () {
    'use strict';

    // requires menuButton.js

    /* globals scUtils, l10nStrings */

    const $passages = document.querySelector('#passages');

    function saveFontSize(value) {
        localStorage.setItem('fontSize', value);
    }

    function loadFontSize() {
        const loaded = localStorage.getItem('fontSize') || '100';
        let value = parseInt(loaded);

        if (isNaN(value)) {
            return 100;
        } else {
            return value;
        }
    }

    function applyFontSize(value) {
        $passages.style.fontSize = `${value}%`;
    }


    function createFontSizeBtn(interval = 10, min = 60, max = 200) {
        let fs = loadFontSize();

        if (fs !== 100) {
            applyFontSize(fs);
            saveFontSize(fs);
        }

        const ops = {
            inc() {
                fs += interval;
                fs = Math.min(fs, max);
            },
            dec() {
                fs -= interval;
                fs = Math.max(fs, min);
            },
        };

        scUtils.createMultiButton('fontSize', l10nStrings.uiFontSize || 'Font size', ['-', '+'], (event, index) => {
            ops[index === 0 ? 'dec' : 'inc']();

            applyFontSize(fs);
            saveFontSize(fs);
        });
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            createFontSizeBtn,
        }
    );
}());