(function() {
    // container version of <<abbr>>
    // usage: <<more "tooltip">>content<</more>>
    'use strict';
    /* globals version, Macro, jQuery */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<more>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.more = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'more-macro';

    const styles = `
        .${clsPrefix} {
            position: relative;
            display: inline;
            cursor: pointer;
            border-bottom: 1px dotted;
        }
        .${clsPrefix}::before {
            content: attr(data-title);
            position: absolute;
            display: table;
            top: 100%;
            left: 0;
            max-width: 25vw;
            padding: 0.3em;
            font-size: 90%;
            pointer-events: none;
            opacity: 0;
            border: 1px solid currentColor;
            transition: 150ms linear all; 
        }
        .${clsPrefix}:active::before,
        .${clsPrefix}:hover::before {
            pointer-events: auto;
            opacity: 1;
            transition: 150ms linear all; 
        }
        /* to avoid setting bg color manually */
        #story, #passages, .passage, .passage *, .passage * .${clsPrefix}, .${clsPrefix}::before {
            background-color: inherit;
        }`;

    jQuery('head').append(`<style type="text/css">${styles}</style>`);

    Macro.add('more', {
        tags: null,
        handler () {
            const more = jQuery(`<abbr class="${clsPrefix}" data-title="${this.args[0]}"></abbr>`);
            new Wikifier(more, this.payload[0].contents);
            more.appendTo(this.output);
        }
    });
}());