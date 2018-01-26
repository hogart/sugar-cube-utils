(function () {
    'use strict';

    /* globals jQuery */

    const clsPrefix = 'faint';

    const styles = `
    .${clsPrefix} {
        z-index: 1000;
        position: fixed;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        
        visibility: hidden;
        opacity: 0;
        transition: 1s linear;
        transition-property: opacity visibility;
    }
    .${clsPrefix}.open {
        visibility: visible;
        opacity: 1;
        transition: 1s linear;
        transition-property: opacity visibility;
    }
    
    body.${clsPrefix}-blur {
        filter: blur(10px);
        transition: 1s filter linear;
    }
    body:not(.${clsPrefix}-blur) {
        filter: blur(0px);
        transition: 1s filter linear;
    }
    `;

    jQuery(`<style type="text/css" id="${clsPrefix}-style">${styles}</style>`).appendTo('head');

    const body = jQuery('body');
    const overlay = jQuery(`<div class="${clsPrefix}"></div>`);
    overlay.appendTo(body);

    function faint(callback = null, duration = 5, color = 'black', blur = true) {
        overlay.css({backgroundColor: color});

        if (blur) {
            body.addClass(`${clsPrefix}-blur`);
        }

        overlay.addClass('open');

        setTimeout(() => {
            if (callback) {
                callback();
            }
            overlay.removeClass('open');
            body.removeClass(`${clsPrefix}-blur`);
        }, duration * 1000);
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            faint,
        }
    );
}());