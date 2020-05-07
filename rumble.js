(function() {
    // makes your devices vibrate.
    // usage: <<rumble 100>> <<rumble 100, 200, 100, 500>> <<rumble stop>>
    // Please remember that Vibration API support is somewhat limited, so don't rely on it in critical parts.
    // Very long sequences may be chopped or completely skipped, it may not work when putting game in iframe,
    // and it often requires user input to start.
    // https://caniuse.com/#feat=vibration
    // https://developer.mozilla.org/docs/Web/API/Navigator/vibrate
    'use strict';
    /* globals version, Macro, Config */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<rumble>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.rumble = {major: 1, minor: 0, revision: 0};

    Macro.add('rumble', {
        handler() {
            if (!navigator.vibrate) {
                if (Config.debug) {
                    console.warn('Vibration not supported, <<rumble>> will do nothing.');
                }

                return;
            }

            const args = this.args;

            if (!args.length && Config.debug) {
                console.error('<<rumble>> needs arguments: stop or comma-delimited positive integers.');

                return;
            }

            if (args[0] === 'stop' || args[0] === '0') {
                navigator.vibrate(0);
            } else {
                const sequence = args.map((chunk) => parseInt(chunk.trim()));
                navigator.vibrate(sequence);
            }
        },
    });
}());