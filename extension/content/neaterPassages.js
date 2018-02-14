'use strict';

restoreOptions().then((options) => {
    document.documentElement.classList.toggle('neatPassages', options.neatPassages);
});

