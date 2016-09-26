(function() {
    // usage:
    // My name is <<genderswitch $isFemale "Mary" "John">> Watson.
    // ...
    // Your father says: My dear <<gender "daughter" "son">>!
    'use strict';
    /* globals version, Macro, insertElement, jQuery, State */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<gender*>> macros family requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.genderswitch = {major: 1, minor: 0, revision: 0};

    const clsPrefix = 'gender';

    const styles = `
        html.${clsPrefix}-f .${clsPrefix}-m,
        html.${clsPrefix}-m .${clsPrefix}-f {
            display: none;
        }`;

    jQuery('head').append(`<style type="text/css">${styles}</style>`);
    const html = document.documentElement;
    html.classList.add(`${clsPrefix}-f`);

    function getLayout(female, male) {
        return `<span class="${clsPrefix}-f">${female}</span><span class="${clsPrefix}-m">${male}</span>`;
    }

    Macro.add('genderswitch', {
        handler () {
            let varName = null;
            if (this.args.length && this.args[0] === undefined) {
                varName = this.args.full.split(' ', 1)[0].replace(/^State\.variables\./, '');
                this.args.shift();
            }

            const layout = getLayout(this.args[1], this.args[2]);
            const link = insertElement(this.output, 'a');

            link.innerHTML = layout;
            link.classList.add(`${clsPrefix}switch-macro`);

            jQuery(link).ariaClick(() => {
                html.classList.toggle(`${clsPrefix}-f`);
                html.classList.toggle(`${clsPrefix}-m`);
                State.variables[varName] = html.classList.contains(`${clsPrefix}-f`);
            });
        }
    });

    Macro.add('gender', {
        handler () {
            const layout = getLayout(this.args[0], this.args[1]);
            const wrapper = insertElement(this.output, 'span');

            wrapper.classList.add(`${clsPrefix}-macro`);
            wrapper.innerHTML = layout;
        }
    });
}());