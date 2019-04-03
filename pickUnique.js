(function () {
    'use strict';

    /* globals random */

    const lastIndex = '__lastIndex';

    function pickUnique(arr) {
        if (!arr.hasOwnProperty(lastIndex)) {
            const value = random(arr.length - 1);
            Object.defineProperty(arr, lastIndex, {
                enumerable: false,
                writable: true,
                value,
            });

            return arr[value];
        } else {
            let newValue;

            do {
                newValue = random(arr.length - 1);
            } while (newValue === arr[lastIndex]);

            arr[lastIndex] = newValue;
            return arr[arr[lastIndex]];
        }
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            pickUnique,
        }
    );
}());