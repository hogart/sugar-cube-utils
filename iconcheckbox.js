(function() {
    // usage: <<iconcheck $isSomething>><</iconcheck>>
    'use strict';
    /* globals version, Macro, jQuery, Wikifier, State */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<iconcheck>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.abbr = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'iconcheck';

    const styles = `
        .${clsPrefix} input {
            visibility: hidden;
        }
        
        .${clsPrefix} input + span::before {
            font-family: tme-fa-icons;
            content: '\\e830\\00a0';
        }
        
        .${clsPrefix} input:checked + span::before {
            content: '\\e831\\00a0';
        }
        `;

    jQuery('head').append(`<style type="text/css">${styles}</style>`);

    Macro.add('iconcheck', {
        tags: null,
        handler () {
            // Ensure that the variable name argument is a string.
            if (typeof this.args[0] !== 'string') {
                return this.error('variable name argument is not a string');
            }

            let varName = this.args[0].trim();

            // Try to ensure that we receive the variable's name (incl. sigil), not its value.
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error(`variable name "${this.args[0]}" is missing its sigil ($ or _)`);
            }

            varName = varName.substring(1);

            const $input = jQuery(`<input type="checkbox" ${State.variables[varName] ? 'checked' : ''}/>`);
            $input.on('change', () => {
                State.variables[varName] = $input.prop('checked');
            });

            const $span = jQuery('<span></span>');
            new Wikifier($span, this.payload[0].contents);

            const $label = jQuery(`<label class="${clsPrefix}"></label>`);

            $input.appendTo($label);
            $span.appendTo($label);

            $label.appendTo(this.output);
        }
    });
}());