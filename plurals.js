(function plurals() {
    // Depends on Intl.PluralRules implemented or polyfilled. At the moment of writing, Chrome only:(
    // See plurals-independent.js for less restrictive implementation (Russian-only, sorry!)
    'use strict';

    const localeTag = document.documentElement.getAttribute('lang') || 'en';
    const pluralRules = new Intl.PluralRules(localeTag);
    const indices = {
        ru: {
            one: 0, // singular
            many: 1, // plural
            few: 2, // 2-4
        },

        en: {
            one: 0, // singular
            other: 1, // plural or zero
        },

        // TODO: add more languages
    };

    // TODO: add more slavic languages here
    indices.pl = indices.ua = indices.ru; // slavic languages share singular/paucal/plural rules

    const langIndex = indices[localeTag] || indices.en;

    /**
     *
     * @param {number} amount
     * @param {string[]} cases For English: ['cat', 'cats]. For slavic languages: ['яблоко', 'яблок', 'яблока']
     * @returns {string}
     */
    function pluralize(amount, cases) {
        const rule = pluralRules.select(amount);
        const index = langIndex[rule];

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