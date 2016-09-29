(function () {
    'use strict';
    // Adds "About" button to UI Bar -- great for things like credits
    // * doesn't show up unless passage named StoryAbout exists
    // * opens dialog with the same title and contents filled from StoryAbout passage
    // * change l10nStrings.uiBarAbout to change both button and dialog title

    /* globals Story, Dialog, jQuery, l10nStrings */

    if (!Story.has('StoryAbout')) {
        return;
    }

    const styleId = 'menu-item-about';
    const styles = `#menu-core #${styleId} a::before {
    font-family: tme-fa-icons, fantasy;
    font-style: normal;
    font-weight: 400;
    font-variant: normal;
    text-transform: none;
    line-height: 1;
    speak: none;

    content: '\\e809\\00a0';
}`;

    jQuery('head').append(`<style type="text/css" id="${styleId}">${styles}</style>`);

    const title = l10nStrings.uiBarAbout || 'About';
    const buttonTemplate = `<li id="${styleId}"><a>${title}</a></li>`;

    const $button = jQuery(buttonTemplate);
    $button.appendTo('#menu-core');
    $button.ariaClick(() => {
        const content = Story.get('StoryAbout').processText();

        Dialog.setup(title);
        Dialog.wiki(content);
        Dialog.open();
    });
}());
