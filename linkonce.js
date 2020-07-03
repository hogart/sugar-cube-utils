(function () {
    'use strict';
    /* globals version, Macro, visited, Story, Config, Wikifier, Engine, State */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<linkonce>> macro requires SugarCube 2.0 or greater, aborting load');
    }

    version.extensions.linkonce = { major: 1, minor: 0, revision: 0 };

    function has(obj, prop) {
        return Object.prototype.hasOwnProperty.call(obj, prop);
    }

    function parseLinkArg(arg) {
        let passage;
        let $content;
        if (arg.isImage) {
            // Argument was in wiki image syntax.
            $content = jQuery(document.createElement('img'))
                .attr('src', arg.source);

            if (has(arg, 'passage')) {
                $content.attr('data-passage', arg.passage);
            }

            if (has(arg,'title')) {
                $content.attr('title', arg.title);
            }

            if (has(arg, 'align')) {
                $content.attr('align', arg.align);
            }

            passage = arg.link;
        } else {
            // Argument was in wiki link syntax.
            $content = jQuery(document.createTextNode(arg.text));
            passage = arg.link;
        }

        return {
            passage,
            $content,
        };
    }

    Macro.add('linkonce', {
        tags: null,
        handler() {
            if (this.args.length === 0) {
                return this.error('no linkonce text specified');
            }

            if (this.args.length > 1) {
                return this.error('linkonce only accepts wiki-syntax: [[link text|Passage name]]');
            }

            const {passage, $content} = parseLinkArg(this.args[0]);
            const hasVisited = visited(passage) > 0;

            const $link = jQuery(document.createElement( hasVisited ? 'span' : 'a'));

            $content.appendTo($link);
            $link.append($content);
            $link.addClass(`macro-${this.name}`);

            if (!hasVisited) {
                if (passage != null) { // lazy equality for null
                    $link.attr('data-passage', passage);

                    if (Story.has(passage)) {
                        $link.addClass('link-internal');

                        if (Config.addVisitedLinkClass && State.hasPlayed(passage)) {
                            $link.addClass('link-visited');
                        }
                    } else {
                        $link.addClass('link-broken');
                    }
                } else {
                    $link.addClass('link-internal');
                }

                $link
                    .ariaClick({
                        namespace: '.macros',
                        one: passage != null, // lazy equality for null
                    }, this.createShadowWrapper(
                        this.payload[0].contents !== ''
                            ? () => Wikifier.wikifyEval(this.payload[0].contents.trim())
                            : null,
                        passage != null // lazy equality for null
                            ? () => Engine.play(passage)
                            : null,
                    ));
            }

            $link.appendTo(this.output);
        },
    });
}());
