'use strict';

const defaultOptions = {
    shortcutButtons: true,
    wideEditors: true,
    neatPassages: false,
};

function restoreOptions(defaults) {
    return new Promise((resolve, reject) => {
        chrome.storage.sync.get(defaults, (items) => {
            resolve(items);
        });
    });
}

function saveOptions(values) {
    return new Promise((resolve) => {
        chrome.storage.sync.set(values, function () {
            resolve();
        });
    })
}

const form = document.querySelector('.js-optionsForm');
const fields = Array.from(form.querySelectorAll('input[type="checkbox"]'));

form.addEventListener('submit', (event) => {
    event.preventDefault();

    const newOptions = {};
    fields.forEach((field) => newOptions[field.name] = field.checked);
    saveOptions(newOptions);
}, false);

document.addEventListener('DOMContentLoaded', async () => {
    const values = await restoreOptions(defaultOptions);
    Object.keys(values).forEach((key) => {
        const val = values[key];
        console.log(val);
        form.querySelector(`[name=${key}]`).checked = val;
    })
});