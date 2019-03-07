(function () {
    'use strict';

    // requires menuButton.js

    /* globals jQuery, scUtils */

    const $story = jQuery('#story');

    function parseFontSize(str) {
        const value = parseFloat(str);
        const units = str.replace(/[\d.]/g, '');

        return {value, units};
    }

    function saveFontSize({value, units}) {
        localStorage.setItem('fontSize', `${value}${units}`);
    }

    function loadFontSize() {
        const loaded = localStorage.getItem('fontSize');
        try {
            let { value, units } = parseFontSize(loaded);

            if (!units || !value || isNaN(value)) {
                return null;
            } else {
                return { value, units };
            }
        } catch (e) {
            return null;
        }
    }

    function extractFontSize() {
        const extracted = window.getComputedStyle($story[0]).fontSize;

        return parseFontSize(extracted);
    }

    function applyFontSize({value, units}) {
        $story[0].style.fontSize = `${value}${units}`;
    }


    function createFontSizeBtn(interval = 0.2) {
        let fs = loadFontSize();
        let cssFs = extractFontSize();

        if (fs === null) {
            fs = cssFs;
            saveFontSize(fs);
        } else {
            Object.assign(fs, cssFs);
            applyFontSize(fs);
        }

        const ops = {
            inc() {
                fs.value += interval * cssFs.value;
            },
            dec() {
                fs.value -= interval * cssFs.value;
            }
        };

        scUtils.createMultiButton('fontSize', ['-', '+'], (event, index) => {
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