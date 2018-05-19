(function() {
    'use strict';

    /* globals State */

    /**
     * Simple quality-based quest tracker. Usage:
     *
     * qbn.set('house', 'ground floor');
     * qbn.set('house', ['basement']);
     * if (qbn.length('house') === 2) { alert('house fully explored') }
     * qbn.set('house', 'ground floor'); // qbn.length('dungeon') still equals 2
     * qbn.unset('house', 'ground floor');
     */

    State.variables.qbnQualities = State.variables.qbnQualities || new Map();
    State.variables.qbnIncrements = State.variables.qbnIncrements || new Map();

    const watchers = new Map();

    function callWatchers(qualityName) {
        const watchersByName = watchers.get(qualityName);
        if (watchersByName) {
            watchersByName.forEach((watcher) => {
                try {
                    watcher(qualityName);
                } catch (e) {
                    console.error(e);
                }
            });
        }
    }

    function addValuesToSet(set, values) {
        values.forEach((value) => set.add(value));
    }

    window.qbn = {
        set(qualityName, values) {
            let set = State.variables.qbnQualities.get(qualityName);
            if (!set) {
                set = new Set();
                State.variables.qbnQualities.set(qualityName, set);
            }

            if (Array.isArray(values)) {
                addValuesToSet(set, values);
            } else {
                set.add(values);
            }

            callWatchers(qualityName);
        },

        unset(qualityName, values) {
            const set = State.variables.qbnQualities.get(qualityName);

            if (set) {
                if (Array.isArray(values)) {
                    values.forEach((value) => set.delete(value));
                } else {
                    set.delete(values);
                }

                callWatchers(qualityName);
            }
        },

        has(qualityName, values) {
            const set = State.variables.qbnQualities.get(qualityName);
            if (!set) {
                return false;
            } else {
                if (Array.isArray(values)) {
                    for (const value of values.values()) {
                        if (!set.has(value)) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return set.has(values);
                }
            }
        },

        inc(qualityName, amount = 1) {
            let counter = State.variables.qbnIncrements.get(qualityName) || 0;

            counter += amount;

            State.variables.qbnIncrements.set(qualityName, counter);
            callWatchers(qualityName);
        },

        dec(qualityName, amount = 1) {
            let counter = State.variables.qbnIncrements.get(qualityName) || 0;

            counter -= amount;

            State.variables.qbnIncrements.set(qualityName, counter);
            callWatchers(qualityName);
        },

        length(qualityName) {
            const set = State.variables.qbnQualities.get(qualityName);
            const increment = State.variables.qbnIncrements.get(qualityName) || 0;
            const setSize = set ? set.size : 0;

            return setSize + increment;
        },

        clear(qualityName) {
            const set = State.variables.qbnQualities.get(qualityName);
            if (set) {
                set.clear();
            }

            State.variables.qbnIncrements.set(qualityName, 0);
            callWatchers(qualityName);
        },

        addWatcher(qualityName, watcher) {
            if (!watchers.has(qualityName)) {
                watchers.set(qualityName, []);
            }

            watchers.get(qualityName).push(watcher);
        },
    };
}());