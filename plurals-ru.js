(function pluralsRu() {
    // See plurals-en.js for English
    'use strict';

    const indexes = [2, 0, 1, 1, 1, 2];

    /**
     *
     * @param {number} amount
     * @param {string[]} cases For slavic languages: ['яблоко', 'яблока', 'яблок']
     * @returns {string}
     */
    function pluralize(amount, cases) {
        const mod100 = amount % 100;
        const mod10 = amount % 10;
        const index = (mod100 > 4 && mod100 < 20) ? 2 : indexes[(mod10 < 5) ? mod10 : 5];
        return cases[index];
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