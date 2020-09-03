(function moreMacro() {
    // usage: <<more "tooltip">>content<</more>>
    'use strict';
    /* globals version, Macro */

    const macroName = 'more';

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error(`<<${macroName}>> macro requires SugarCube 2.0 or greater, aborting load`);
    }

    version.extensions[macroName] = {major: 1, minor: 0, revision: 0};

    const clsPrefix = `more${macroName}`;

    class Tooltiper {
        constructor(options) {
            this.options = Object.assign({}, {
                container: document.body,
                clsPrefix,
            }, options);

            this.container = typeof this.options.container === 'string' ? document.querySelector(this.options.container) : this.options.container;

            this.target = null;

            this.onMouseOver = this.onMouseOver.bind(this);
            this.onMouseOut = this.onMouseOut.bind(this);

            this.addListeners();
        }

        createTooltip() {
            this.el = document.createElement('div');
            this.el.className = this.options.clsPrefix;
            this.container.appendChild(this.el);
        }

        onMouseOver(event) {
            const target = event.target.closest(`[data-${this.options.clsPrefix}]`);

            if (target) {
                if (this.target !== target) {
                    this.target = target;
                }

                this.show();
            } else {
                this.hide();
            }
        }

        onMouseOut(event) {
            if (event.relatedTarget === this.el) {
                return;
            }

            this.hide();
        }

        show() {
            if (!this.el) {
                this.createTooltip();
            }

            const targetRect = this.target.getBoundingClientRect();

            this.el.innerHTML = this.target.dataset[clsPrefix];

            const position = this.getPosition(targetRect);

            this.el.style.minWidth = targetRect.width + 'px';
            this.el.style.top = position.top + pageYOffset + targetRect.height + 'px';
            this.el.style.left = position.left + pageXOffset + 'px';

            this.container.appendChild(this.el);
            this.el.classList.add('visible');
        }

        getPosition(rect) {
            let {top, left} = rect;
            const {offsetHeight, offsetWidth} = this.el;

            if (rect.top + rect.height + offsetHeight > window.innerHeight) {
                top = rect.top - (offsetHeight + rect.height);
            }

            if (rect.left + rect.width + offsetWidth > window.innerWidth) {
                left = rect.left - Math.abs(rect.width - offsetWidth);

                if (left < 0) {
                    left = 0;
                }
            }

            return {top, left};
        }

        hide() {
            if (this.el) {
                this.el.classList.remove('visible');
                this.el.remove();
            }
        }

        addListeners() {
            this.container.addEventListener('mouseover', this.onMouseOver);
            this.container.addEventListener('mouseout', this.onMouseOut);
        }

        removeListeners() {
            this.container.removeEventListener('mouseover', this.onMouseOver);
            this.container.removeEventListener('mouseout', this.onMouseOut);
        }

        destroy() {
            this.removeListeners();
        }
    }

    const styles = `
        .${clsPrefix} {
            position: absolute;
            z-index: 1000;
            opacity: 0;
            background-color: inherit;
            border: 1px solid currentColor;
            max-width: 90%;
            padding: 4px 10px;
            font-size: 90%;
            transition: opacity 150ms linear;
            pointer-events: auto;
            box-shadow: 0px 0px 1em 0px;
        }

        body #story, body #story .${clsPrefix} {
            background-color: inherit;
        }

        .${clsPrefix}.visible {
            opacity: 1;
            pointer-events: none;
        }

        [data-${clsPrefix}] {
            border-bottom: 1px dotted currentColor;
            cursor: pointer;
        }
        `;

    jQuery('head').append(`<style type="text/css" id="${macroName}-style">${styles}</style>`);

    new Tooltiper({container: '#story'});

    Macro.add(macroName, {
        tags: null,
        handler () {
            const more = jQuery(`<abbr data-${clsPrefix}="${this.args[0]}"></abbr>`);
            more.wiki(this.payload[0].contents);
            more.appendTo(this.output);
        },
    });
}());