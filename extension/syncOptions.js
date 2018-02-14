'use strict';

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