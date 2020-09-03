(function promiseLockFactory() {
    'use strict';

    // Given a promise, locks the screen until the promise resolved
    // Useful for loading huge scripts, styles, images and other assets

    /* globals LoadScreen */

    function promiseLock(promise) {
        const lockId = LoadScreen.lock();
        promise.then(() => {
            LoadScreen.unlock(lockId);
        });
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            promiseLock,
        },
    );
}());