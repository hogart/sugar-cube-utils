(function achievementStorageFactory() {
    'use strict';

    /* globals storage */

    class AchievementStorage {
        /**
         * @param {IStoredAchievement[]} items
         */
        async save(items) {
            await storage.set(
                'unlocked',
                JSON.stringify(items)
            );
        }

        /**
         * @return {IStoredAchievement[]}
         */
        async load() {
            return await JSON.parse(storage.get('unlocked') || '[]').map((a) => {
                return {id: a.id, date: new Date(a.date)};
            });
        }
    }

    window.scUtils = Object.assign(window.scUtils || {}, {
        AchievementStorage,
    });
}());