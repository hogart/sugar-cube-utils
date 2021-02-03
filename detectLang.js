(function detectLangFactory() {
    'use strict';

    const pathNameMatcher = /(-[a-z]{2})?\.html$/;
    function byPath() {
        let lang = 'ru';
        const match = window.location.pathname.match(pathNameMatcher);
        if (match && match[1]) {
            lang = match[1].substr(1);
        }

        return lang;
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            detectLang: {
                byPath,
            },
        }
    );
}());