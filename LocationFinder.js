(function () {
    'use strict';

    /* globals Story, visitedTags, Config, scUtils */

    class LocationFinder {
        constructor() {
            this.markers = [];

            // we don't really do lookUp, but it's the only way to iterate over all passages
            Story.lookupWith((passage) => {
                const marker = LocationFinder.extractLocations(passage.tags);

                if (marker) {
                    this.markers.push(marker);
                }
            });

            this.markers.sort((locA, locB) => {
                return locA.order - locB.order;
            });

            if (Config.debug) {
                console.info(`Locations detected:
                ${this.markers.map((marker) => `${marker.order}: ${marker.name}`).join('\n')}`);
            }
        }

        /**
         * Reverse iterate over all known locations, last visited tag wins, or the first one appearing in story.
         *
         * @returns {string}
         */
        detectLocation() {
            for (let i = this.markers.length - 1; i > -1; i--) {
                const marker = this.markers[i];
                const tagName = `${LocationFinder.nameToken}${marker.name}`;
                const tagOrder = `${LocationFinder.orderToken}${marker.order}`;
                if (visitedTags(tagName, tagOrder)) {
                    return marker.name;
                }
            }

            return this.markers[0].name;
        }

        /**
         * @param {String[]} tags
         * @returns {{name: string, order: number | undefined}}
         */
        static extractLocations(tags) {
            const locationTag = tags.find(tag => tag.startsWith(LocationFinder.nameToken));

            if (locationTag) {
                const name = locationTag.replace(LocationFinder.nameToken, '');
                const orderTag = tags.find(tag => tag.startsWith(LocationFinder.orderToken));

                if (Config.debug && !orderTag) {
                    console.warn(`Location "${name}" doesn't have explicit order.`)
                }

                return {
                    name,
                    order: parseInt(orderTag.replace(LocationFinder.orderToken, ''), 10) || 0,
                }
            }
        }

        static get nameToken() {
            return 'locationName-';
        }

        static get orderToken() {
            return 'locationOrder-';
        }
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            LocationFinder,
        }
    );
}());