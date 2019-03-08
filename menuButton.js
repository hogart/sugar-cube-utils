(function () {
    'use strict';

    // Utility functions to create buttons in dock menu.
    // scUtils.createPassageButton creates button which opens dialog displaying passage with given name.
    // scUtils.createHandlerButton creates button which calls given handler.
    // Both methods return {button, style} objects with jQuery-wrapped references to created elements

    /* globals Story, Dialog, jQuery */

    // save some DOM references for later use
    const $head = jQuery('head');
    const $menuCore = jQuery('#menu-core');

    function createButton(id, label, onClick) {
        const buttonTemplate = `<li id="${id}"><a>${label}</a></li>`;
        const $button = jQuery(buttonTemplate);

        $button.ariaClick(onClick);
        $button.appendTo($menuCore);

        return $button;
    }

    function createMultiButton(id, mainLabel, labels, onClick) {
        const buttonTemplate = `
            <li id="${id}" class="multiButton">
                ${mainLabel ? `<div class="mainLabel">${mainLabel}</div>` : ''}
                <div class="buttons">
                    ${labels.map(label => `<a>${label}</a>`).join('')}
                </div>
            </li>`;
        const $button = jQuery(buttonTemplate);
        $button.on('click', 'a', (event) => {
            const index = jQuery(event.currentTarget).index();
            onClick(event, index);
        });

        if (jQuery(`style#multi-button-style`).length === 0) {
            const styles = `
                .multiButton .mainLabel {
                    text-transform: uppercase;
                }
                .multiButton .buttons {
                    display: flex;
                }
                .multiButton .buttons a {
                    flex-grow: 1;
                }`;

            const $style = jQuery(`<style type="text/css" id="multi-button-style">${styles}</style>`);
            $style.appendTo($head);
        }

        $button.appendTo($menuCore);

        return {button: $button};
    }

    function createButtonStyle(id, iconContent) {
        const styles = `
            #menu-core #${id} a::before {
                ${iconContent ? `content: '${iconContent}'` : ''};
            }
        `;

        const $style = jQuery(`<style type="text/css" id="${id}-style">${styles}</style>`);
        $style.appendTo($head);

        return $style;
    }

    function createDlgFromPassage(passageName, title) {
        const content = Story.get(passageName).processText();

        Dialog.setup(title);
        Dialog.wiki(content);
        Dialog.open();
    }

    /**
     * Creates button in UI dock opening given passage.
     * @param {string} label Button label
     * @param {string} iconContent Some UTF sequence, like `\\e809\\00a0`
     * @param {string} passageName Passage name to display in dialogue
     * @return {{button: jQuery, style: jQuery}}
     */
    function createPassageButton(label, iconContent, passageName) {
        const id = `menu-item-${passageName}`;

        return {
            button: createButton(id, label, () => createDlgFromPassage(passageName, label)),
            style: createButtonStyle(id, iconContent),
        };
    }

    /**
     * Creates button in UI dock which calls `handler` when clicked.
     * @param {string} label Button label
     * @param {string} iconContent Some UTF sequence, like `\e809\00a0`
     * @param {string} shortName any unique identifier, only letters, digits, dashes, underscore
     * @param {Function} handler Function to call on click/tap
     * @return {{button: jQuery, style: jQuery}}
     */
    function createHandlerButton(label, iconContent, shortName, handler) {
        const id = `menu-item-${shortName}`;

        return {
            button: createButton(id, label, handler),
            style: createButtonStyle(id, iconContent),
        };
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            createPassageButton,
            createHandlerButton,
            createMultiButton,
        }
    );
}());