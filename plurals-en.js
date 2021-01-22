(function pluralsEn() {
    // See plurals-ru.js for Russian
    'use strict';

    /**
     *
     * @param {number} amount
     * @param {string[]} cases Third case is optional and is used for zero ['apples', 'apples', 'no apples']
     * @returns {string}
     */
    function pluralize(amount, cases) {
        if (amount === 1) {
            return cases[0];
        } else if (cases.length === 3 && amount === 0) {
            return cases[2];
        } else {
            return cases[1];
        }
    }

    const amountRe = /\${amount}/mg;
    const pluralRe = /\${plural}/mg;

    function pluralizeFmt(cases, tpl) {
        function fmt(amount, plural) {
            return tpl
                .replace(amountRe, amount)
                .replace(pluralRe, plural);
        }

        return (amount) => {
            const plural = pluralize(amount, cases);
            return fmt(amount, plural);
        };
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            pluralize,
            pluralizeFmt,
        }
    );
}());