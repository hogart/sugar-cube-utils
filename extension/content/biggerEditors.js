'use strict';

restoreOptions().then((options) => {
    document.documentElement.classList.toggle('wideEditors', options.wideEditors);
});

