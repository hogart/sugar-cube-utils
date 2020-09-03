(function linkifMacro() {
    'use strict';
    /* globals version, Macro, Story, Config, State, Wikifier, Engine */

    const macroName = 'linkif';

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error(`<<${macroName}>> macro requires SugarCube 2.0 or greater, aborting load`);
    }

    version.extensions[macroName] = { major: 1, minor: 0, revision: 0 };

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

    Macro.add(macroName, {
        tags: null,
        handler() {
            if (this.args.length !== 2) {
                return this.error(`${macroName} only accepts wiki-syntax: [[link text|Passage name]] and a variable/expression`);
            }

            const {passage, $content} = parseLinkArg(this.args[0]);
            const isLink = this.args[1];

            const $link = jQuery(document.createElement( isLink ? 'a' : 'span'));

            $content.appendTo($link);
            $link.append($content);
            $link.addClass(`macro-${this.name}`);

            if (isLink) {
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