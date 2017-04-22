(function() {
    'use strict';

    /**
     * Simple quality-based quest tracker. Usage:
     *
     * qbn.set('house', 'ground floor');
     * qbn.set('house', ['basement']);
     * if (qbn.length('house') === 2) { alert('house fully explored') }
     * qbn.set('house', 'ground floor'); // qbn.length('dungeon') still equals 2
     * qbn.unset('house', 'ground floor');
     */

    const qualities = new Map();
    const increments = new Map();

    function addValuesToSet(set, values) {
        values.forEach((value) => set.add(value))
    }

    window.qbn = {
        set(qualityName, values) {
            let set = qualities.get(qualityName);
            if (!set) {
                set = new Set();
                qualities.set(qualityName, set);
            }

            if (Array.isArray(values)) {
                addValuesToSet(set, values);
            } else {
                set.add(values);
            }
        },

        unset(qualityName, values) {
            const set = qualities.get(qualityName);

            if (set) {
                if (Array.isArray(values)) {
                    values.forEach((value) => set.delete(value));
                } else {
                    set.delete(values);
                }
            }
        },

        has(qualityName, values) {
            const set = qualities.get(qualityName);
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
            let counter = increments.get(qualityName) || 0;

            counter += amount;

            increments.set(qualityName, counter);
        },

        dec(qualityName, amount = 1) {
            let counter = increments.get(qualityName) || 0;

            counter -= amount;

            increments.set(qualityName, counter);
        },

        length(qualityName) {
            const set = qualities.get(qualityName);
            const increment = increments.get(qualityName) || 0;
            const setSize = set ? set.size : 0;

            return setSize + increment;
        },

        clear(qualityName) {
            const set = qualities.get(qualityName);
            if (set) {
                set.clear();
            }

            increments.set(qualityName, 0);
        },
    };
}());