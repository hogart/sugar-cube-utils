/* globals SugarCube, jQuery */
(function(SugarCube) {
    // usage: <<abbr "text" "long explanation">>
    'use strict';

    const {version, Macro} = SugarCube;

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<abbr>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.abbr = {major: 1, minor: 2, revision: 1};

    const clsPrefix = 'abbr-macro';

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

    Macro.add('abbr', {
        handler () {
            const abr = jQuery(`<abbr class="${clsPrefix}" data-title="${this.args[1]}">${this.args[0]}</abbr>`);
            abr.appendTo(this.output);
        }
    });
    console.log(Macro.has('abbr'));
}(SugarCube.version ? SugarCube : {version, Macro}));