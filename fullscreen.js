(function () {
    'use strict';

    // requires menuButton.js
    //
    // fullscreen API is a pain at the moment
    // https://developer.mozilla.org/en-US/docs/Web/API/Fullscreen_API

    /* globals l10nStrings, scUtils */

    // each vendor has it's spelling, so we can't just iterate prefixes
    const isFullScreenEnabled = document.fullscreenEnabled || document.webkitFullscreenEnabled || document.mozFullScreenEnabled || document.msFullscreenEnabled;
    if (!isFullScreenEnabled) {
        // no fullscreen, don't create the button
        return;
    }

    function isFullScreen(doc) {
        return !!(doc.fullscreenElement || doc.webkitFullscreenElement || doc.mozFullScreenElement || doc.msFullscreenElement);
    }

    function getRequestFullScreenFn(el) {
        return (el.requestFullscreen || el.webkitRequestFullscreen || el.mozRequestFullScreen || el.msRequestFullscreen);
    }

    function getExitFullScreenFn(doc) {
        return doc.exitFullscreen ||doc.webkitExitFullscreen || doc.mozCancelFullScreen || doc.msExitFullscreen;
    }

    const requestFullScreenFn = getRequestFullScreenFn(document.documentElement);
    // without bound context, there's `Illegal invocation` exception
    const requestFullScreen = requestFullScreenFn.bind(document.documentElement);
    const exitFullScreen = getExitFullScreenFn(document).bind(document);


    // stored vendor-prefixes, mapped to requestFullScreen function name
    const vendorSelectorsMap = {
        requestFullscreen: 'fullscreen',
        webkitRequestFullscreen: '-webkit-full-screen',
        mozRequestFullScreen: '-moz-full-screen',
        msRequestFullscreen: '-ms-full-screen',
    };

    const selector = vendorSelectorsMap[requestFullScreenFn.name];

    function handler() {
        if (isFullScreen(document)) {
            exitFullScreen();
        } else {
            requestFullScreen();
        }
    }

    const {style} = scUtils.createHandlerButton(l10nStrings.uiFullScreen || 'Full screen', '', 'fullscreen', handler);
    const styleId = style.attr('id').replace(/-style$/, '');
    const styles = `
#menu-core #${styleId} a::before {
    content: '\\e830\\00a0';
}

html:${selector} {
    height: 100%;
}

:${selector} body {
    height: calc(100% - 2.5em);
    padding-top: 2.5em;
}

:${selector} #story {
    margin-top: 0;
}

:${selector} #menu-core #${styleId} a::before { 
    content: '\\e831\\00a0'; 
}
`;

    style.text(styles);
}());