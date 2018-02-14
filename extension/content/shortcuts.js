'use strict';

function triggerEvent(element, type = 'click') {
    const event = new MouseEvent(type, {
        view: window,
        bubbles: true,
        cancelable: true
    });

    element.dispatchEvent(event);
}

function button(icon, title) {
    return `<button title="${title}" data-action="${icon}"><i class="fa fa-${icon} fa-lg"></i></button>`;
}

const enabledButtons = ['terminal', 'css3', 'book', 'download', 'sitemap'];
const titles = {
    terminal: 'Edit Story JavaScript',
    css3: 'Edit Story StyleSheet',
    book: 'View Proofing Copy',
    download: 'Publish to File',
    sitemap: 'Snap all passages',
};

function getMenu(toolbar) {
    const menuButton = toolbar.querySelector('.storyName');
    triggerEvent(menuButton);
    triggerEvent(menuButton);

    return document.querySelector('.drop-content div .menu:first-child');
}

function getMenuButtons(menu) {
    const [editJsBtn, editCssBtn, ...rest] = menu.querySelectorAll('li button');
    const proofBtn = rest[rest.length - 2];
    const publishBtn = rest[rest.length - 1];

    return {
        editJsBtn,
        editCssBtn,
        proofBtn,
        publishBtn,
    }
}

function createContainer() {
    const buttonsContainer = document.createElement('div');

    buttonsContainer.innerHTML = enabledButtons.map((btn) => {
        return button(btn, titles[btn]);
    }).join('');
    buttonsContainer.className = 'toolbarButtons';

    return buttonsContainer;
}

function waitForElement(selector, parent = document) {
    return new Promise((resolve, reject) => {
        function getElem() {
            const elem = parent.querySelectorAll(selector);
            if (elem.length) {
                resolve(elem);
            } else {
                setTimeout(getElem)
            }
        }

        getElem();
    });
}

const buttonsContainer = createContainer();

detectStoryEditor(async () => {
    const options = await restoreOptions();

    if (!options.shortcutButtons) {
        return;
    }

    const toolbar = await waitForElement('.toolbar.main .left');

    if (toolbar[0].querySelector('.toolbarButtons')) {
        return;
    }

    const menu = getMenu(toolbar[0]);

    attachToDom(menu);

    function attachToDom(menu) {
        const {editJsBtn, editCssBtn, proofBtn, publishBtn} = getMenuButtons(menu);

        const actions = {
            terminal() {
                triggerEvent(editJsBtn);
            },
            css3() {
                triggerEvent(editCssBtn);
            },
            book() {
                triggerEvent(proofBtn);
            },
            download() {
                triggerEvent(publishBtn);
            },
            sitemap() {
                snapPassages();
                window.location.reload();
            },
        };

        buttonsContainer.addEventListener('click', (event) => {
            let button = event.target.matches('button') ? event.target : event.target.parentNode;
            if (actions[button.dataset.action]) {
                actions[button.dataset.action]();
            }
        });

        toolbar[0].appendChild(buttonsContainer);
    }
});




