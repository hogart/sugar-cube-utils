(function skipIntroFactory() {
    'use strict';

    /* globals visited, storage, l10nStrings, Engine */

    function addStyles() {
        const styles = `
            p.skipIntro {
                text-align: right;
                margin-top: 3em;
                font-size: 80%;
            }
        `;

        const $style = jQuery(`<style type="text/css" id="skip-intro">${styles}</style>`);
        $style.appendTo('head');
    }

    function prepareLink(firstNonIntroPassage, label) {
        const $p = jQuery(`<p class="skipIntro"><a class="link-internal" tabindex="0">${label}</a></p>`);

        $p.on('click', 'a', () => Engine.play(firstNonIntroPassage));

        return $p;
    }

    function skipPassageFactory(skipPassages, skipTags) {
        return function skipPassageDetector(passage) {
            return skipPassages.includes(passage.title) || skipTags.includesAny(passage.tags);
        };
    }

    function skipIntro(firstNonIntroPassage, label = l10nStrings.uiSkipIntro || 'Skip intro', skipPassages = [], skipTags = []) {
        const $doc = jQuery(document);
        const skipPassageDetector = skipPassageFactory(skipPassages, skipTags);
        let $p;

        function onPassageDisplay(event) {
            if (visited(firstNonIntroPassage) === 0) {
                if (!skipPassageDetector(event.passage, skipPassages, skipTags)) {
                    $p.appendTo(event.content);
                }
            } else {
                $doc.off(':passagedisplay', onPassageDisplay);
            }
        }

        function onPassageDisplayMaiden() {
            if (visited(firstNonIntroPassage) === 1) {
                storage.set('skipIntro', true);
                $doc.off(':passagedisplay', onPassageDisplayMaiden);
            }
        }

        if (storage.get('skipIntro')) {
            addStyles();
            $p = prepareLink(firstNonIntroPassage, label);
            $doc.on(':passagedisplay', onPassageDisplay);
        } else {
            $doc.on(':passagedisplay', onPassageDisplayMaiden);
        }
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            skipIntro,
        }
    );
}());