(function() {
    'use strict';

    /* globals State */

    /**
     * Simple quality-based quest tracker. Usage:
     *
     * qbn.set('house', 'ground floor');
     * qbn.set('house', ['basement']);
     * if (qbn.length('house') === 2) { alert('house fully explored') }
     * qbn.set('house', 'ground floor'); // qbn.length('house') still equals 2
     * qbn.unset('house', 'ground floor');
     */

    console.log(State.variables.qbnQualities);
    State.active.variables.qbnQualities = State.active.variables.qbnQualities || new Map();
    State.active.variables.qbnIncrements = State.active.variables.qbnIncrements || new Map();

    const watchers = Object.create(null);

    function callWatchers(qualityName) {
        const watchersByName = watchers[qualityName];
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
        values.forEach((value) => set[value] = true);
    }

    function clearSet(set) {
        Object.keys(set).forEach(key => delete set[key]);
    }

    window.qbn = {
        set(qualityName, values) {
            let set = State.variables.qbnQualities[qualityName];
            if (!set) {
                set = Object.create(null);
                State.variables.qbnQualities[qualityName] = set;
            }

            if (Array.isArray(values)) {
                addValuesToSet(set, values);
            } else {
                set[values] = true;
            }

            callWatchers(qualityName);
        },

        unset(qualityName, values) {
            const set = State.variables.qbnQualities[qualityName];

            if (set) {
                if (Array.isArray(values)) {
                    values.forEach((value) => delete set[value]);
                } else {
                    delete set[values];
                }

                callWatchers(qualityName);
            }
        },

        has(qualityName, values) {
            const set = State.variables.qbnQualities[qualityName];
            if (!set) {
                return false;
            } else {
                if (Array.isArray(values)) {
                    for (const value of values.values()) {
                        if (!set[value]) {
                            return false;
                        }
                    }
                    return true;
                } else {
                    return set[values];
                }
            }
        },

        inc(qualityName, amount = 1) {
            let counter = State.variables.qbnIncrements[qualityName] || 0;

            counter += amount;

            State.variables.qbnIncrements[qualityName] = counter;
            callWatchers(qualityName);
        },

        dec(qualityName, amount = 1) {
            let counter = State.variables.qbnIncrements[qualityName] || 0;

            counter -= amount;

            State.variables.qbnIncrements[qualityName] = counter;
            callWatchers(qualityName);
        },

        length(qualityName) {
            const set = State.variables.qbnQualities[qualityName];
            const increment = State.variables.qbnIncrements[qualityName] || 0;
            const setSize = set ? Object.keys(set).length : 0;

            return setSize + increment;
        },

        clear(qualityName) {
            const set = State.variables.qbnQualities[qualityName];
            if (set) {
                clearSet(set);
            }

            State.variables.qbnIncrements[qualityName] = 0;
            callWatchers(qualityName);
        },

        addWatcher(qualityName, watcher) {
            if (!watchers[qualityName]) {
                watchers[qualityName] = [];
            }

            watchers[qualityName].push(watcher);
        },
    };
}());