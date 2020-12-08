(function volumeButton() {
    'use strict';

    // requires menuButton.js

    /* globals scUtils, l10nStrings, storage */

    function saveVolume(value) {
        storage.setItem('masterVolume', value);
    }

    function loadVolume() {
        const loaded = storage.getItem('masterVolume') || '1.0';
        let value = parseFloat(loaded);

        if (isNaN(value)) {
            return 1;
        } else {
            return value;
        }
    }

    function applyVolume(value) {
        jQuery.wiki(`<<masteraudio volume ${value}>>`);
    }

    function saveMute(value) {
        storage.set('masterMute', value);
    }

    function loadMute() {
        const loaded = storage.get('masterMute') || 'false';

        return loaded === 'true';
    }

    function applyMute(value) {
        jQuery.wiki(`<<masteraudio ${value ? 'mute' : 'unmute'}>>`);
    }

    function clampVolume(volume) {
        return parseFloat(
            Math.min(
                Math.max(volume, 0.0),
                1.0
            ).toFixed(1)
        );
    }

    function createVolumeButtons(interval = 0.2, labels = ['🔈', '🔇', '🔊']) {
        let volume = loadVolume();

        if (volume !== 1.0) {
            applyVolume(volume);
            saveVolume(volume);
        }

        let mute = loadMute();
        if (mute !== true) {
            applyMute(mute);
            saveMute(mute);
        }

        const ops = {
            dec() {
                volume = clampVolume(volume - interval);
            },
            mute() {
                mute = !mute;
            },
            inc() {
                volume = clampVolume(volume + interval);
            },
        };

        function updateUI(button) {
            button.find('a').removeAttr('disabled');

            if (volume === 0) {
                button.find('a:eq(0)').attr('disabled', true);
            } else if (volume === 1) {
                button.find('a:eq(2)').attr('disabled', true);
            }

            if (mute) {
                button.find('a:eq(1)').addClass('active');
            } else {
                button.find('a:eq(1)').removeClass('active');
            }
        }

        const {button} = scUtils.createMultiButton('fontSize', l10nStrings.uiVolumeControl || 'Volume', labels, (event, index) => {
            if (index === 0) {
                ops.dec();
            } else if (index === 1) {
                ops.mute();
            } else {
                ops.inc();
            }

            updateUI(button);

            applyVolume(volume);
            saveVolume(volume);

            applyMute(mute);
            saveMute(mute);
        });

        updateUI(button);
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            createVolumeButtons,
        },
    );
}());