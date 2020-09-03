(function preloadImagesUtil() {
    'use strict';

    /* globals LoadScreen */

    function preloadImage(source, strict = false) {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => {
                resolve(img);
            };
            if (strict) {
                img.onerror = reject;
            } else {
                img.onerror = () => {
                    resolve(null);
                };
            }

            img.src = source;
        });
    }

    function preloadImages(sources, strict) {
        const lock = LoadScreen.lock();
        const method = strict ? Promise.all : Promise.any;
        return method(
            sources.map(
                (src) => preloadImage(src, strict)
            )
        ).finally(() => LoadScreen.unlock(lock));
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            preloadImages,
        }
    );
}());