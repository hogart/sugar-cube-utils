(function () {
    'use strict';

    /* globals random, Story */

    const lastIndex = '__lastIndex';

    function has(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function _extendArray(arr, value = null) {
        if (value === null) {
            value = random(arr.length - 1);
        }

        Object.defineProperty(arr, lastIndex, {
            enumerable: false,
            writable: true,
            value,
        });
    }

    function _getNextUnique(arr) {
        let newValue;

        do {
            newValue = random(arr.length - 1);
        } while (newValue === arr[lastIndex]);

        arr[lastIndex] = newValue;
        return arr[arr[lastIndex]];
    }

    /**
     * @param {any[]} arr
     * @return {any}
     */
    function pickUnique(arr) {
        if (!has(arr, lastIndex)) {
            const value = random(arr.length - 1);
            _extendArray(arr, value);

            return arr[value];
        } else {
            return _getNextUnique(arr);
        }
    }

    function createUniquePicker(arr) {
        _extendArray(arr);

        return function () {
            return _getNextUnique(arr);
        };
    }

    function _getPassageLines(passage) {
        let text;
        if (passage.processText) { // we have passage itself
            text = passage.processText();
        } else { // we have passage name
            const rawPassage = Story.get(passage);
            if (!rawPassage) {
                throw new Error(`No such passage: "${passage}".`);
            }

            text = rawPassage.processText();
        }

        return text.split('\n');
    }

    /**
     * @param {string|Passage} passage
     * @return {function (): string}
     */
    function createUniquePickerFromPassage(passage) {
        const arr = _getPassageLines(passage);

        return createUniquePicker(arr);
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            pickUnique,
            createUniquePicker,
            createUniquePickerFromPassage,
        }
    );
}());