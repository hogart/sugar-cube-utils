(function () {
    'use strict';

    /* globals random */

    class RandomSource {
        constructor(array) {
            this._array = array;
            this.current = this.randomElement();
        }

        /**
         * Returns random integer between 0 and max (inclusive)
         * @param max
         */
        static randomInt(max) {
            // return Math.floor(Math.random() * Math.floor(max));
            return random(max - 1);
        }

        randomIndex() {
            return RandomSource.randomInt(this._array.length);
        }

        randomElement() {
            return this._array[this.randomIndex()];
        }

        randomUniqueElement() {
            let newValue;

            do {
                newValue = this.randomElement();
            } while (newValue === this.current);

            this.current = newValue;

            return newValue;
        }
    }


    window.scUtils = Object.assign(
        window.scUtils || {},
        {
            RandomSource,
        }
    );
}());