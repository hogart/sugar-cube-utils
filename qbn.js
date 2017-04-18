(function() {
    'use strict';

    /**
     * Simple quality-based quest tracker. Usage:
     *
     * qbn.set('house', 'ground floor');
     * qbn.set('house', 'basement');
     * if (qbn.length('dungeon') === 2) { alert('house fully explored') }
     * qbn.set('house', 'ground floor'); // qbn.length('dungeon') still equals 2
     */

    const qualities = new Map();
    const increments = new Map();

    window.qbn = {
        set(qualityName, value) {
            const set = qualities.get(qualityName);
            if (!set) {
                qualities.set(qualityName, new Set());
            }

            qualities.get(qualityName).add(value);
        },

        unset(qualityName, value) {
            const set = qualities.get(qualityName);

            if (set) {
                return set.has(value);
            } else {
                return false;
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