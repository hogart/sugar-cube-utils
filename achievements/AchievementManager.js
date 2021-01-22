(function achievementManagerFactory() {
    'use strict';

    class AchievementManager {
        /**
         * @param {IAchievement[]} list
         * @param {Function} onUnlock
         */
        constructor(list, onUnlock) {
            this.list = list;
            this.onUnlock = onUnlock;

            const weight = this.list.reduce((weight, /** @type {IAchievement} */achievement) => {
                return weight + achievement.weight;
            }, 0);

            if (!isNaN(weight)) {
                this.totalWeight = weight;
            }
        }

        test() {
            /** @type IAchievement[] */
            const unlocked = []; // it's possible to unlock several achievements at once
            for (const achievement of this.list) {
                if (!achievement.unlocked && achievement.test()) {
                    achievement.unlocked = true;
                    achievement.date = new Date();
                    unlocked.push(achievement);
                }
            }

            if (unlocked.length) {
                this.onUnlock(unlocked);
            }
        }

        /**
         * @return {IAchievementOverview}
         */
        getOverview() {
            /** @type IAchievementOverview */
            const overview = {
                locked: [],
                unlocked: [],
                hidden: 0,
                weight: 0,
            };

            return this.list.reduce((overview, achievement) => {
                if (achievement.unlocked) {
                    overview.unlocked.push(achievement);
                    if (this.totalWeight) {
                        overview.weight += achievement.weight;
                    }
                } else {
                    if (achievement.hidden) {
                        overview.hidden += 1;
                    } else {
                        overview.locked.push(achievement);
                    }
                }

                return overview;
            }, overview);
        }
    }

    window.scUtils = Object.assign(window.scUtils || {}, {
        AchievementManager,
    });
}());
