(function () {
    'use strict';

    /* globals State, Story, Macro, passage */

    const varPrefix = '$__simLife_';

    /**
     * @param {string} varName
     * @return {any}
     */
    function getVar(varName) {
        return State.getVar(`${varPrefix}${varName}`);
    }

    /**
     * @param {string} varName
     * @param {any} value
     */
    function setVar(varName, value) {
        State.setVar(`${varPrefix}${varName}`, value);
    }

    /**
     * @param {any} value
     * @return {'string' | 'number' | 'boolean'}
     */
    function getType(value) {
        return Object.prototype.toString.call(value).replace(/^\[object /, '').replace(/]$/, '').toLowerCase();
    }

    /**
     * @param {any} object
     * @param {string} field
     * @return {boolean}
     */
    function hasOwn(object, field) {
        return Object.prototype.hasOwnProperty.call(object, field);
    }


    const daysMap = [
        'Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat',
    ];

    /**
     * @param {Date} date
     * @return {string}
     */
    function getDayOfWeek(date) {
        return daysMap[date.getDay()];
    }

    function validateDistances(distances) {
        const nonExistentPassages = [];

        for (const [fromPassage, toPassages] of Object.entries(distances)) {
            if (!Story.get(fromPassage)) {
                nonExistentPassages.push(fromPassage);
            }

            for (const passage of Object.keys(toPassages)) {
                if (!Story.get(passage)) {
                    nonExistentPassages.push(passage);
                }
            }
        }

        if (nonExistentPassages.length) {
            throw new Error(`Distance map points to non-existing passages: ${nonExistentPassages.join()}`);
        }

        return distances;
    }

    /**
     * @param {WeekSchedule} schedule
     * @return {string[]}
     */
    function validateSchedule(schedule) {
        const nonExistentPassages = [];

        for (const daySchedule of Object.values(schedule)) {
            Object.keys(daySchedule).forEach((loc) => {
                if (!Story.get(loc)) {
                    nonExistentPassages.push(loc);
                }
            });
        }

        return nonExistentPassages;
    }

    /**
     *
     * @param {NPC[]} npcs
     */
    function validateNPCs(npcs) {
        const missingIds = [];
        const missingSchedules = [];
        const missingLocations = [];
        const incorrectLocations = [];

        for (const [index, npc] of npcs.entries()) {
            if (!npc.id) {
                missingIds.push(index);
            }

            if (!npc.schedule) {
                missingSchedules.push(npc.id);
            } else {
                incorrectLocations.push(...validateSchedule(npc.schedule));
            }

            if (!npc.location) {
                missingLocations.push(npc.id);
            }

            if (!Story.get(npc.location)) {
                incorrectLocations.push(npc.location);
            }
        }

        if (missingIds.length) {
            throw new Error(`Some NPCs are missing ids: NPCs ##${missingIds.join()}`);
        }

        if (missingSchedules.length) {
            throw new Error(`Some NPCs are missing schedules: ${missingSchedules.join()}`);
        }

        if (missingLocations.length) {
            throw new Error(`Some NPCs are missing starting locations: ${missingLocations.join()}`);
        }

        if (incorrectLocations.length) {
            throw new Error(`Some NPCs have incorrect locations either as starting locations or in schedule: ${missingLocations.join()}`);
        }

        return npcs;
    }

    /**
     * @param {number} number
     * @return {string}
     */
    function padTwoDigit(number) {
        return number.toString().padStart(2, '0');
    }

    /**
     * @param {Date} time
     * @return {string}
     */
    function formatHHMM(time) {
        const timeToFormat = time || getVar('currentTime');
        return `${padTwoDigit(timeToFormat.getUTCHours())}:${padTwoDigit(timeToFormat.getUTCMinutes())}`;
    }

    /**
     * @param {string} time
     * @return {{mins: number, hrs: number}}
     */
    function parseHHMM(time) {
        const [hrs, mins] = time.split(':').map(chunk => parseInt(chunk, 10));
        return {hrs, mins};
    }

    /**
     * @param {[string, string]|string} interval
     * @param {Date} time
     * @return {boolean}
     */
    function isInInterval(interval, time) {
        const formatted = formatHHMM(time);
        let start, end;
        if (Array.isArray(interval)) {
            [start, end] = interval;
        } else if (getType(interval) === 'string') {
            [start, end] = interval.trim().split(/\s+/);
        }

        if (start < end) { // ['09:00', '17:00'] -- during the same calendar day
            return formatted > start && formatted <= end;
        } else { // ['23:00', '06:00'] -- crossing the midnight
            return formatted > start || formatted <= end;
        }
    }

    const $doc = jQuery(document);

    /**
     * @param {SetupOptions} options
     */
    function setUp(options) {
        setVar('currentTime', options.currentTime || new Date());
        setVar('distances', validateDistances(options.distances || {}));
        setVar('NPCs', validateNPCs(options.NPCs || []));

        $doc.on(':passageinit', (event) => travel(event.passage.title));
    }

    /**
     * @param {number|string} timeToAdd
     */
    function addTime(timeToAdd) {
        /** @type Date */
        const currentTime = getVar('currentTime');

        if (getType(timeToAdd) === 'number') {
            currentTime.setUTCMinutes(currentTime.getUTCMinutes() + timeToAdd);
        } else if (getType(timeToAdd) === 'string') {
            const {hrs, mins} = parseHHMM(timeToAdd);
            currentTime.setUTCHours(currentTime.getUTCHours() + hrs);
            currentTime.setUTCMinutes(currentTime.getUTCMinutes() + mins);
        }

        const day = getDayOfWeek(currentTime);

        /** @type NPC[] */
        const NPCs = getVar('NPCs');
        for (const npc of NPCs) {
            if (npc.schedule[day]) {
                for (const location of Object.keys(npc.schedule[day])) {
                    for (const interval of npc.schedule[day][location]) {
                        if (isInInterval(interval, currentTime)) {
                            npc.location = location;
                            break;
                        }
                    }
                }
            }
        }
    }

    Macro.add('addTime', {
        handler() {
            addTime(this.args[0]);
        },
    });

    function getDistanceBetween(fromPassage, toPassage) {
        if (fromPassage === '') { // is a special "passage" played before the start
            return 0;
        }

        if (!Story.get(fromPassage)) {
            throw new Error('No such passage: ' + fromPassage);
        }

        if (!Story.get(toPassage)) {
            throw new Error('No such passage: ' + toPassage);
        }

        /** @type DistanceMap */
        const distances = getVar('distances');

        if (distances[fromPassage]) {
            if (distances[fromPassage][toPassage]) {
                return distances[fromPassage][toPassage];
            }
        } else if (distances[toPassage]) {
            if (distances[toPassage][fromPassage]) {
                return distances[toPassage][fromPassage];
            }
        }

        return 0;
    }

    function travel(incomingPassage) {
        const distance = getDistanceBetween(State.passage, incomingPassage);

        if (distance) {
            addTime(distance);
        }
    }

    /**
     * @param {string|NPC} npcOrId
     * @returns NPC
     */
    function getNPC(npcOrId) {
        if (getType(npcOrId) === 'string') {
            for (const npc of getVar('NPCs')) {
                if (npc.id === npcOrId) {
                    return npcOrId;
                }
            }

            throw new Error(`No such NPC: "${npcOrId}"`);
        } else if (hasOwn(npcOrId, 'id') && hasOwn(npcOrId, 'location') && hasOwn(npcOrId, 'schedule')) {
            return npcOrId;
        } else {
            throw new TypeError(`Expected NPC or id, got ${JSON.stringify(npcOrId)}`);
        }
    }

    /**
     * @param {string|NPC} npcOrId
     * @return {boolean}
     */
    function isNPCHere(npcOrId) {
        const currentLocation = passage();
        const npc = getNPC(npcOrId);
        return npc.location === currentLocation;
    }

    /**
     * @param {string?} locationName
     * @return {NPC[]}
     */
    function getNPCsAt(locationName) {
        const location = locationName || passage();

        if (!Story.get(location)) {
            throw new Error(`No such location ${location}`);
        }

        return getVar('NPCs').filter(npc => npc.location === location);
    }

    window.simLife = Object.assign(
        window.simLife || {},
        {
            setUp,

            isInInterval,
            addTime,
            formatHHMM,
            parseHHMM,

            getNPC,
            isNPCHere,
            getNPCsAt,
        }
    );
}());