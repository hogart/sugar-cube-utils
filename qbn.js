(function() {
    'use strict';

    /* globals State */

    /**
     * Simple quality-based quest tracker. Usage:
     *
     * scUtils.qbn.set('house', 'ground floor');
     * scUtils.qbn.set('house', ['basement']);
     * if (scUtils.qbn.length('house') === 2) { alert('house fully explored') }
     * scUtils.qbn.set('house', 'ground floor'); // scUtils.qbn.length('house') still equals 2
     * scUtils.qbn.unset('house', 'ground floor');
     */

    State.active.variables.qbnQualities = State.active.variables.qbnQualities || {};
    State.active.variables.qbnIncrements = State.active.variables.qbnIncrements || {};

    const watchers = {};

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

    const qbn = {
        set(qualityName, values) {
            let set = State.active.variables.qbnQualities[qualityName];
            if (!set) {
                set = {};
                State.active.variables.qbnQualities[qualityName] = set;
            }

            if (Array.isArray(values)) {
                addValuesToSet(set, values);
            } else {
                set[values] = true;
            }

            callWatchers(qualityName);
        },

        unset(qualityName, values) {
            const set = State.active.variables.qbnQualities[qualityName];

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
            const set = State.active.variables.qbnQualities[qualityName];
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
            let counter = State.active.variables.qbnIncrements[qualityName] || 0;

            counter += amount;

            State.active.variables.qbnIncrements[qualityName] = counter;
            callWatchers(qualityName);
        },

        dec(qualityName, amount = 1) {
            let counter = State.active.variables.qbnIncrements[qualityName] || 0;

            counter -= amount;

            State.active.variables.qbnIncrements[qualityName] = counter;
            callWatchers(qualityName);
        },

        length(qualityName) {
            const set = State.active.variables.qbnQualities[qualityName];
            const increment = State.active.variables.qbnIncrements[qualityName] || 0;
            const setSize = set ? Object.keys(set).length : 0;

            return setSize + increment;
        },

        clear(qualityName) {
            const set = State.active.variables.qbnQualities[qualityName];
            if (set) {
                clearSet(set);
            }

            State.active.variables.qbnIncrements[qualityName] = 0;
            callWatchers(qualityName);
        },

        addWatcher(qualityName, watcher) {
            if (!watchers[qualityName]) {
                watchers[qualityName] = [];
            }

            watchers[qualityName].push(watcher);
        },
    };

    window.qbn = qbn;

    window.scUtils = Object.assign(window.scUtils || {}, {
        qbn,
    });
}());