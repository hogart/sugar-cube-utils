(function achievementRendererFactory(dateFormat, dialogTitle, pluralize) {
    'use strict';

    /* globals scUtils, Dialog, Story */

    function defaultDateFormat (date) {
        return date.toString();
    }

    dateFormat = dateFormat === null
        ? null
        : (dateFormat || defaultDateFormat);

    class AchievementRenderer {
        /**
         * @param {IAchievement[]} achievements
         */
        constructor(achievements) {
            this.storage = new window.scUtils.AchievementStorage();

            jQuery(document).on(':passagedisplay', this.onPassageDisplay.bind(this));

            this.$notificationContainer = this.createNotificationContainer();

            this.setupSidebarButton();

            this.setupIcon();

            this.load().then((unlocked) => {
                this.prepareUnlockedAchievements(achievements, unlocked);

                this.manager = new window.scUtils.AchievementManager(achievements, this.onUnlock.bind(this));
            });
        }

        /**
         * @param {IAchievement[]} achievements
         * @param {IStoredAchievement[]} unlocked
         */
        prepareUnlockedAchievements(achievements, unlocked) {
            achievements.forEach((achievement) => {
                const unlockedItem = unlocked.find((a) => achievement.id === a.id);
                if (unlockedItem) {
                    achievement.unlocked = true;
                    achievement.date = unlockedItem.date;
                }
            });
        }

        /**
         * @return {jQuery<HTMLElement>}
         */
        createNotificationContainer() {
            const $notificationContainer = jQuery('<div class="achievements-container"></div>');
            $notificationContainer.appendTo('body');
            $notificationContainer.on('click', () => {
                this.displayAchievementsList();
            });

            return $notificationContainer;
        }

        setupSidebarButton() {
            scUtils.createHandlerButton(dialogTitle, '\\e809\\00a0', 'achievements', () => {
                this.displayAchievementsList();
            });
        }

        setupIcon() {
            this._icon = Story.get('icon-achievement').processText();
        }

        /**
         * @return {Promise<IStoredAchievement[]>}
         */
        async load() {
            return await this.storage.load();
        }

        /**
         * @param {IStoredAchievement[]} items
         * @return {Promise<void>}
         */
        async save(items) {
            await this.storage.save(items);
        }

        /**
         * @param {IAchievement[]} achievements
         * @return {Promise<void>}
         */
        async onUnlock(achievements) {
            const existingItems = await this.load();
            const toSave = achievements.map((a) => {
                return { id: a.id, date: a.date.toString() };
            });
            await this.save([...existingItems, ...toSave]);
            this.displayNotification(achievements);
        }

        /**
         * @param {IAchievement[]} achievements
         */
        displayNotification(achievements) {
            this.$notificationContainer.html(
                achievements.map(this.renderAchievement, this)
            );
            this.$notificationContainer.addClass('open');

            setTimeout(this.hideNotification.bind(this), 5000);
        }

        hideNotification() {
            this.$notificationContainer.removeClass('open');
            this.$notificationContainer.one('animationend', () => {
                this.$notificationContainer.html('');
            });
        }

        displayAchievementsList() {
            const overview = this.manager.getOverview();

            let html = `
                ${overview.unlocked.map(this.renderAchievement, this).join('')}
            `;

            if (overview.hidden > 0) {
                const hiddenAchievements = pluralize(overview.hidden, overview.unlocked.length);
                html += `<p>${hiddenAchievements}</p>`;
            }

            Dialog.setup(dialogTitle, 'achievement-dialog');
            Dialog.append(html);
            Dialog.open();
        }

        onPassageDisplay() {
            this.manager.test();
        }

        /**
         * @param {IAchievement} achievement
         * @return {string}
         */
        renderAchievement(achievement) {
            const dateLine = dateFormat ? `<p class="achievement-date">${dateFormat(achievement.date)}</p>` : '';
            return `
                <div class="achievement">
                    ${this._icon}
                    <div class="achievement-content">
                        <h6 class="achievement-title">${achievement.title}</h6>
                        <p class="achievement-text">${achievement.description}</p>
                        ${dateLine}
                    </div>
                </div>
            `;
        }
    }

    window.scUtils = Object.assign(window.scUtils || {}, {
        AchievementRenderer,
    });
}(
    null, /* null disables showing date completely; pass a function here to format date, or undefined for default formatting */
    'Achievements', /* Dialog and button title */
    (hiddenAchievementsCount, unlockedAchievementsCount) => { /* Pluralizer function (which renders 'And 3 hidden achievements' after the list) */
        const template = unlockedAchievementsCount > 0 ? 'And ${amount} ${plural}.' : '${amount} ${plural}.';
        return scUtils.pluralizeFmt(['hidden achievement', 'hidden achievements'], template)(hiddenAchievementsCount);
    }
));