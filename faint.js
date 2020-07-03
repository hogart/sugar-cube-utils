(function () {
    'use strict';

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
        transition-property: opacity, visibility;
    }
    .${clsPrefix}.open {
        visibility: visible;
        opacity: 1;
        transition: 1s linear;
        transition-property: opacity, visibility;
    }

    html.${clsPrefix}-blur {
        filter: blur(10px);
        transition: 1s filter linear;
        /* without these 2 lines, firefox does weird things */
        height: 100%;
        overflow: hidden;
    }
    `;

    jQuery(`<style type="text/css" id="${clsPrefix}-style">${styles}</style>`).appendTo('head');

    const body = jQuery('body');
    const doc = jQuery('html');
    const overlay = jQuery(`<div class="${clsPrefix}"></div>`);
    overlay.appendTo(body);

    function comeTo() {
        overlay.removeClass('open');
        doc.removeClass(`${clsPrefix}-blur`);
    }

    function faint(callback = null, duration = 5, color = 'black', blur = true) {
        overlay.css({backgroundColor: color});

        if (blur) {
            doc.addClass(`${clsPrefix}-blur`);
        }

        overlay.addClass('open');

        setTimeout(() => {
            if (callback) {
                callback();
                setTimeout(comeTo, 100); // make a small delay to let callback finish
            } else {
                comeTo();
            }

        }, duration * 1000);
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            faint,
        }
    );
}());