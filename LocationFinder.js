/* globals SugarCube, jQuery, scUtils */
(function (SugarCube) {
    'use strict';

    const {Story, visitedTags, Config} = SugarCube;

    class LocationFinder {
        constructor() {
            const markers = [];

            // we don't really do lookUp, but it's the only way to iterate over all passages
            Story.lookupWith((passage) => {
                const marker = LocationFinder.extractLocations(passage.tags);

                if (marker) {
                    markers.push(marker);
                }
            });

            markers.sort((locA, locB) => {
                return locA.order - locB.order;
            });

            this.locationNames = markers.map(marker => marker.name);
        }

        /**
         * Reverse iterate over all known locations, last visited tag wins, or the first one appearing in story.
         *
         * @returns {string}
         */
        detectLocation() {
            for (let i = this.locationNames.length; i > -1; i--) {
                const tagName = `${LocationFinder.nameToken}${this.locationNames[i]}`;
                if (visitedTags(tagName)) {
                    return this.locationNames[i];
                }
            }

            return this.locationNames[0];
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

}(SugarCube.Story ? SugarCube : {Story, visitedTags, Config}));