(function LocationFinder() {
    'use strict';

    /* globals Story, Config, State */

    class LocationFinder {
        constructor(onChange = null, classNamePrefix = 'location-', eventHandlers = null) {
            this.markers = [];

            // we don't really do lookUp, but it's the only way to iterate over all passages
            Story.lookupWith((passage) => {
                const marker = LocationFinder.extractLocations(passage.tags);

                if (marker) {
                    this.markers.push(marker);
                }
            });

            if (Config.debug) {
                console.info(
                    `Locations detected:
                    ${this.markers.map((marker) => `\t${marker}`).join('\n')}`
                );
            }

            this.latestLocation = this.detectLocation();

            this.$doc = jQuery(document);
            this.$html = jQuery(document.documentElement);

            this.onChange = onChange;
            this.classNamePrefix = classNamePrefix;

            this._listenPassageStart();

            if (eventHandlers) {
                this._processHandlers(eventHandlers);
            }

            this._toggleHtmlClass(this.latestLocation);
        }

        _processHandlers(eventHandlers) {
            Object.keys(eventHandlers).forEach((eventName) => {
                this.$doc.on(eventName, (event) => {
                    eventHandlers[eventName](this.detectLocation(), event);
                });
            });
        }

        _onChange(newLocation, oldLocation) {
            if (Config.debug) {
                console.info(`Location "${oldLocation}" changed to "${newLocation}"`);
            }

            if (this.onChange) {
                this.onChange(newLocation, oldLocation);
            }

            this._toggleHtmlClass(newLocation, oldLocation);
        }

        _listenPassageStart() {
            this.$doc.on(':passagestart', () => {
                const newLocation = this.detectLocation();

                if (newLocation !== this.latestLocation) {
                    this._onChange(newLocation, this.latestLocation);
                    this.latestLocation = newLocation;
                };
            });
        }

        _toggleHtmlClass(newLocation, oldLocation) {
            if (this.classNamePrefix) {
                this.$html
                    .removeClass(this.classNamePrefix + oldLocation)
                    .addClass(this.classNamePrefix + newLocation);
            }
        }

        /**
         * Iterates over history detecting latest visited location, or defaults to the first one found in story.
         *
         * @returns {string}
         */
        detectLocation() {
            let counter = State.length - 1;
            while (counter > 0) {
                const moment = State.index(counter);
                const passage = Story.get(moment.title);
                for (const tag of passage.tags) {
                    if (tag.startsWith(LocationFinder.nameToken)) {
                        return LocationFinder.getLocationNameFromTag(tag);
                    }
                }
                counter--;
            }

            return this.markers[0];
        }

        /**
         * @param {string[]} tags
         * @returns {string}
         */
        static extractLocations(tags) {
            const locationTag = tags.find(tag => tag.startsWith(LocationFinder.nameToken));

            if (locationTag) {
                return LocationFinder.getLocationNameFromTag(locationTag);
            }
        }

        /**
         * @param {string} tag
         * @return {string}
         */
        static getLocationNameFromTag(tag) {
            return tag.substring(LocationFinder.nameToken.length);
        }

        static get nameToken() {
            return 'locationName-';
        }
    }

    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            LocationFinder,
        }
    );
}());