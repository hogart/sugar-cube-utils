(function() {
    // usage: <<abbr "text" "long explanation">>
    'use strict';
    /* globals version, Macro, jQuery, insertElement */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<abbr>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.macro = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'abbr-macro';

    const styles = `
        ${clsPrefix} {
            position: relative;
            display: inline-block;
            cursor: pointer;
            border-bottom: 1px dotted;
        }
        ${clsPrefix}::before {
            content: attr(data-title);
            position: absolute;
            top: 100%;
            left: 0;
            width: 12em;
            padding: 0.3em;
            font-size: 90%;
            pointer-events: none;
            opacity: 0;
            border: 1px solid;
            border-color: #444;
            transition: 150ms linear all; 
        }
        ${clsPrefix}:active::before,
        ${clsPrefix}:hover::before {
            pointer-events: auto;
            opacity: 1;
            transition: 150ms linear all; 
        }
        ${clsPrefix}::before {
            color: #eee;
            background-color: #111;
        }
        html.daymode ${clsPrefix}::before { /* remove this if you're not using daymode */
            color: #111;
            background-color: #fff;
            border-color: #ccc;
            transition: 150ms linear all; 
        }`;

    jQuery('head').append(`<style type="text/css">${styles}</style>`);

    Macro.add('abbr', {
        handler () {
            const abbr = insertElement(this.output, 'abbr');
            abbr.classList.add(clsPrefix);

            abbr.innerHTML = this.args[0];
            abbr.dataset.title = this.args[1];
        }
    });
}());