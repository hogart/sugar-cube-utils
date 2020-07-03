(function() {
    /**
     * <<journaladd "Santa Claus" "characters">>Lives on North Pole (this is journal entry content)<</journaladd>>
     * <<journaladd "Santa Claus" "characters">>Has 4 reindeers<</journaladd>>
     * <<journaldisplay "Santa Claus" "characters">>Gift giver (this serves as optional title)<</journaldisplay>>
     * // renders all entries in order they were entered
     *
     * <<journalreplace "Santa Claus" "characters">>Doesn't exist!!!<</journalreplace>>
     * <<journaldisplay "Santa Claus" "characters">><</journaldisplay>>
     * // Will show only one entry
     *
     * <<journalreplace "Santa Claus" "characters" true>>(Nothing will be shown when journaldisplay called)<</journalreplace>>
     * Note that you need to have exactly 3 arguments for this to work
     *
     * All arguments are optional and defaults to empty strings
     * <<journaladd "Santa Claus">>Have all journal entries in one place<</journaladd>>
     * <<journalreplace "Santa Claus" "">><</journalreplace>>
     *
     * Entries content gets rendered when <<journaldisplay>> is used, not when they are added:
     * <<set $melike = "pies">>
     * <<journaladd>>I like $melike!<</journaladd>>
     * <<set $melike = "ice cream">>
     * <<journaldisplay>>Me<</journaldisplay>>
     *
     * Internally, all entries are stored in `State.variables.journal`.
     */
    'use strict';

    /* globals version, State, Macro */

    if (!version || !version.title || 'SugarCube' !== version.title || !version.major || version.major < 2) {
        throw new Error('<<journal*>> macros family requires SugarCube 2.0 or greater, aborting load');
    }

    if (!State.variables.journal) {
        State.variables.journal = {};
    }

    function ensureNameType(args) {
        let name = args[0] || '';
        let type = args[1] || '';

        if (name.startsWith('$')) {
            name = State.variables.journal[name.slice(1)];
        }

        if (type.startsWith('$')) {
            type = State.variables.journal[type.slice(1)];
        }

        if (!State.variables.journal[type]) {
            State.variables.journal[type] = {};
        }

        return {name, type};
    }

    Macro.add('journaladd', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);
            const entry = this.payload[0].contents.trim();

            if (!State.variables.journal[type][name]) {
                State.variables.journal[type][name] = [];
            }

            State.variables.journal[type][name].push(entry);
        },
    });

    Macro.add('journalreplace', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);

            if (this.args.length === 3 && this.args[2] === true) {
                State.variables.journal[type][name] = [];
            } else {
                State.variables.journal[type][name] = [this.payload[0].contents];
            }
        },
    });

    function getTitle(payload) {
        return payload[0].contents || '';
    }

    function renderJournalSection(title, entries) {
        const out = jQuery(`<header class="journalHeader">${title}</header><ul class="journalEntries">${entries.map(e => `<li>${e}</li>`).join('')}</ul>`);
        return out;
    }

    Macro.add('journaldisplay', {
        tags: null,
        handler () {
            const {name, type} = ensureNameType(this.args);

            const title = getTitle(this.payload);
            const entries = State.variables.journal[type][name];

            if (entries && entries.length) {
                const out = renderJournalSection(title, entries);
                out.appendTo(this.output);
            }
        },
    });
}());