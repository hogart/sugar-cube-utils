(function hubnav(renderLinkWrapper) {
    'use strict';
    /* globals version, Story, Config, Macro, passage, Engine, State */
    const macroname = 'hubnav';

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error(`<<${macroname}>> macros family requires SugarCube 2.0 or greater, aborting load`);
    }

    renderLinkWrapper = renderLinkWrapper || function(link) {
        const span = link.wrap('<span>');
        span.append('<br/>');
        return span;
    };

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

    function createLink({passage, $content}, ctx) {
        const $link = jQuery(document.createElement( 'a'));

        $content.appendTo($link);
        $link.append($content);
        $link.addClass(`macro-${macroname}`);

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
            }, ctx.createShadowWrapper(
                null,
                passage != null // lazy equality for null
                    ? () => Engine.play(passage)
                    : null,
            ));

        return $link;
    }

    function isLink(arg) {
        return arg && jQuery.isPlainObject(arg) && ('link' in arg);
    }

    Macro.add(macroname, {
        handler() {
            if (this.args.length === 0) {
                return this.error(`no ${macroname} links specified`);
            }

            const currentPassage = passage();

            const links = [];

            if (this.args.length === 1 && typeof this.args[0] === 'string') {
                // single string argument: find all passages with given tag and use them as navigation
                const passages = Story.lookupWith(p => p.tags.includes(this.args[0]))
                    .map(p => p.title);
                for (const passageTitle of passages) {
                    if (passageTitle !== currentPassage) {
                        links.push({
                            $content: jQuery(document.createTextNode(passageTitle)),
                            passage: passageTitle,
                        });
                    }
                }
            } else {
                for (let i = 0, len = this.args.length; i < len; i++) {
                    const arg = this.args[i];
                    if (isLink(arg)) {
                        const parsed = parseLinkArg(arg);
                        if (parsed.passage === currentPassage) {
                            continue;
                        }

                        const nextArg = this.args[i + 1];

                        if (i < len - 1 && !isLink(nextArg)) { // next is not a link
                            if (nextArg) {
                                links.push(parsed);
                                i++; // skip next round
                            }
                        } else {
                            links.push(parsed);
                        }
                    }
                }
            }

            const $output = jQuery(this.output);

            links.forEach((link) => {
                $output.append(renderLinkWrapper(createLink(link, this)));
            });
        },
    });
}());