(function () {
    'use strict';

    /* globals Engine */

    const $doc = jQuery(document);

    function onPassagePresent(callback) {
        if (Engine.isRendering()) { // if we're calling this fn from <<run>> or <<script>> directly, when passage is prepared
            $doc.one(':passagedisplay', callback);
        } else { // if it's called from inside <<linkappend>> or something, after passage've been displayed already
            callback();
        }
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            onPassagePresent,
        },
    );
}());