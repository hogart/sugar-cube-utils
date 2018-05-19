(function() {
    // usage:
    // My name is <<genderswitch $isFemale "Mary" "John">> Watson.
    // ...
    // Your father says: My dear <<gender "daughter" "son">>!
    'use strict';
    /* globals version, Macro, jQuery, State */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<gender*>> macros family requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.genderswitch = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'gender';

    const styles = `
        html.${clsPrefix}-f .${clsPrefix}-m,
        html.${clsPrefix}-m .${clsPrefix}-f {
            display: none;
        }
        .${clsPrefix}switch-macro {
            border-bottom: 1px dotted;
            text-decoration: none;
        }
        .${clsPrefix}switch-macro:hover, .${clsPrefix}switch-macro:active {
            border-bottom: 1px solid;
            text-decoration: none;
        }`;

    jQuery('head').append(`<style type="text/css">${styles}</style>`);
    const html = document.documentElement;
    html.classList.add(`${clsPrefix}-f`);

    function getLayout(female, male) {
        return `<span class="${clsPrefix}-f">${female}</span><span class="${clsPrefix}-m">${male}</span>`;
    }

    Macro.add('genderswitch', {
        handler () {
            if (this.args.full.length === 0) {
                return this.error('no variable and values specified');
            }

            const varName = this.args.full.split(' ')[0].replace(/^State\.variables\./, '');
            const layout = getLayout(this.args[1], this.args[2]);
            const link = jQuery(`<a class="${clsPrefix}switch-macro">${layout}</a>`);

            link.appendTo(this.output);

            link.ariaClick(() => {
                html.classList.toggle(`${clsPrefix}-f`);
                html.classList.toggle(`${clsPrefix}-m`);
                State.variables[varName] = html.classList.contains(`${clsPrefix}-f`);
            });
        },
    });

    Macro.add('gender', {
        handler () {
            const layout = getLayout(this.args[0], this.args[1]);
            const wrapper = jQuery(`<span class="${clsPrefix}-macro">${layout}</span>`);
            wrapper.appendTo(this.output);
        },
    });
}());