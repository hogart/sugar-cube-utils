(function iconcheckMacro() {
    // usage:
    // <<iconcheck $isSomething>>toggle value<</iconcheck>>
    // <<iconcheck $isSomething "Turn on" "Turn off">><</iconcheck>>
    'use strict';
    /* globals version, Macro, Wikifier, State */

    const macroName = 'iconcheck';

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error(`<<${macroName}>> macro requires SugarCube 2.0 or greater, aborting load`);
    }

    version.extensions.abbr = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'iconcheck';

    const styles = `
        .${macroName} {
            cursor: pointer;
        }
        .${macroName} input {
            visibility: hidden;
        }

        .${macroName} input + span::before {
            font-family: tme-fa-icons;
            content: '\\e830\\00a0';
        }

        .${macroName} input:checked + span::before {
            content: '\\e831\\00a0';
        }
        `;

    jQuery('head').append(`<style type="text/css" id="${macroName}-style">${styles}</style>`);

    Macro.add(macroName, {
        tags: null,
        handler () {
            const {args, payload} = this;
            // Ensure that the variable name argument is a string.
            if (typeof args[0] !== 'string') {
                return this.error('variable name argument is not a string');
            }

            let varName = args[0].trim();

            // Try to ensure that we receive the variable's name (incl. sigil), not its value.
            if (varName[0] !== '$' && varName[0] !== '_') {
                return this.error(`variable name "${args[0]}" is missing its sigil ($ or _)`);
            }

            varName = varName.substring(1);

            let onChange = null;
            if (args[3]) {
                if (typeof args[3] === 'function') {
                    onChange = args[3];
                } else if (typeof args[3] === 'string' && window[args[3]]) {
                    onChange = window[args[3]];
                }
            }


            const $span = jQuery('<span></span>');
            const $input = jQuery(`<input type="checkbox" ${State.variables[varName] ? 'checked' : ''}/>`);
            $input.on('change', () => {
                const value = $input.prop('checked');
                State.variables[varName] = value;
                $span.html(getLabel());

                if (onChange) {
                    onChange(value);
                }
            });

            function getLabel() {
                if (args.length >= 3) {
                    return State.variables[varName] ? args[1] : args[2];
                } else {
                    return payload[0].contents;
                }
            }

            new Wikifier($span, getLabel());

            const $label = jQuery(`<label class="${clsPrefix}"></label>`);

            $input.appendTo($label);
            $span.appendTo($label);

            $label.appendTo(this.output);
        },
    });
}());