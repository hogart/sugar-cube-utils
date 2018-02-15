# Collection of [SugarCube 2](http://www.motoslave.net/sugarcube/2/) macros and goodies

Please note that code will not work in older browsers as-is. See [Using the code](#using-the-code) section below.

## Macros

Most macros include built-in styles created by JS so you can copy-paste one file instead of two. Styles are as unobtrusive and neutral as possible.

### `<<abbr "text" "tooltip content">>` and `<<more "tooltip content">>text<</more>>`

Both macros do the same thing: show tooltip when user hovers or taps on underlined text. Both highlight text with dotted underline. The only difference is that `<<more>>` allows to put any SugarCube markup (conditions and formatting) inside.

### `<<gender>>` and `<<genderswitch>>`

English grammar is pretty neutral when it comes to gender, but other languages are less forgiving. For instance, in Slavic languages you need to put adjectives and past tense verbs in proper grammatical gender.

`<<genderswitch>>` displays link-like text which user can click to switch between genders:
`My name is <<genderswitch $isFemale "Mary" "John">> Watson.`. Please note that you need to declare `$isFemale` variable before that (most probably in `StoryInit`).

`<<gender>>` chooses text between female and male version: `Your father says: My dear <<gender "daughter" "son">>!`. `<<genderswitch>>` assigns `gender-f` and `gender-m` classes to `html` element, so `<<gender>>` displays changes reactively, and you can use these classes to further customise game look should you need that.

This can also be used to tell a story from perspectives of two persons regardless grammatical gender.

### `<<iconcheck>>`

Default checkboxes can look ugly and not fit into overall visual style. So `<<iconcheck>>` displays neat switch icon in the same style as built-in SugarCube controls.
Simplest form is `<<iconcheck $isSomething>>toggle value<</iconcheck>>`, this will display same label no matter what the value is.
Most flexible form looks like this and allows you to run some callback when value changes: 
```
<<set _handler = function (value) { alert(value ? 'You turned it on!' : 'You turned it off!') }
<<iconcheck $isSomething "Turn on" "Turn off" _handler>><</iconcheck>>
```

### `<<rumble>>`

Makes you device vibrate, and does nothing if browser/device doesn't [support](https://caniuse.com/#feat=vibration) [Vibration API](https://developer.mozilla.org/docs/Web/API/Navigator/vibrate). Please keep in mind that support is spotty (mostly Android and iOS Chrome and Firefox, no gamepads at all), and long vibrations or sequences can be chopped or dropped entirely, so don't rely on it to convey critical parts of story. Also be polite and provide players with means to turn it off completely. 

```
<<rumble 100>> <!-- single vibration pulse -->
<<rumble 100, 200, 100, 500>> <!-- sequence of vibration and pauses -->
<<rumble stop>> or <<rumble 0>> <!-- stop vibrating immedeatly -->
```

Some browsers require user interaction to vibrate, so you'll probably need to wrap this in `<<link>>`.

## Goodies

Most goodies/utils put functions into `window.scUtils` "namespace". Things that create buttons in UIBar rely on `menuButton.js`, so include it in your script before.


### `menuButton.js`

Provide `scUtils.createPassageButton(label, iconContent, passageName)` and `scUtils.createHandlerButton(label, iconContent, shortName, handler)` functions. First create button which displays dialogue window displaying some passage content.

### `about.js` (relies on menuButton.js)

If story have passage titled `StoryAbout`, adds "About" button which displays dialogue window with this passage rendered inside. Good for providing links to your website/patreon and attributing used assets. To change button label, assign value to correspondent l10n key:`l10nStrings.uiBarAbout = 'Who made this wonderful game?'` 

### `daymode.js` and `daymode.css` (relies on menuButton.js)

Depending on players reading habits, level of fatigue, device, environment and other things author can't predict it can be strainous for eyes to read both white on black or black on white. So let them invert theme when they see fit. Daymode switches your game between default (white on black) theme and (slightly adapted) official but not included bleached.css.

### faint.js

Exposes `scUtils.faint(callback, duration, color, blur)` function, which fills screen with solid `color`, `blur`ring content at the same time and calls `callback` after `duration` seconds. Default values are `faint(callback = null, duration = 5, color = 'black', blur = true)`. Keep in mind that not all browsers support this blurring.

Useful for emulating loosing conscience, teleportation, extended periods of time passing, etc.

### fullscreen.js (relies on menuButton.js)

Adds "Full screen" button switch to UIBar (if browser supports this API). Supposedly increases immersion. To change button label, assign value to correspondent l10n key:`l10nStrings.uiFullScreen = 'Immersive mode'`.

### LocationFinder.js

Game can consist of different locations. Suppose you want to change some styles and switch background music depending on whether player is in dungeon, forest or desert. Using vanilla SugarCube you'll need to assign designated tag to every passage in each location (and 100 passages is not a very big game). Now add music to equation and remember that player can save/load and use checkpoints. 

`scUtils.LocationFinder` partially solves this issue. 
0. Tag passages where player enters new locations with `locationName-desert` and`locationOrder-0`, `locationName-forest` and`locationOrder-1`, and so on. `locationOrder-` should have numbers according to how player supposed to move through story.
0. Call `window.finder = new scUtils.LocationFinder()` in `StoryInit` or in game JavaScript.
0. Call `var _newLocation = window.finder.detectLocation()` to get location name anytime you need.

Unfortunately, at the moment LocationFinder won't properly work in open-world games where players can freely move back and forth and back again.

### mute.js (relies on menuButton.js)

Adds "Sound" button switch to UIBar, which mutes/unmutes SugarCube audio engine (note id doesn't stop playback). To change button label, assign value to correspondent l10n key:`l10nStrings.uiBarMute = 'Shut up'`.

### plurals.js and plurals-independent.js

**Not really ready for production at the moment**
While English (and most Germanic and Latin languages) only has two plural forms -- singular, and, well, plural, other languages can have more complex rules. For instance, Slavic languages have 3 forms (for 1 item, for 2..5 items, for lots of items, and they start to repeat when you reach 21), and that's not the limit, Arabic has 6 such forms. So to avoid things like "You have 0 message(s)", you need some utility function. `scUtils.pluralize` and `scUtils.pluralizeFmt` provide that.

`scUtils.pluralize` takes array of cases and amount: `scUtils.pluralize(['cat', 'cats'], numberOfCats)` or `scUtils.pluralize(['яблоко', 'яблок', 'яблока'], numberOfApples)` and return proper string. `scUtils.pluralizeFmt` takes array of cases and template and returns a function which takes number and returns cases and number wrapped in template:
```js
var bulletAmount = window.scUtils.pluralizeFmt(['патрон', 'патрона', 'патронов'], 'У вас ${amount} ${plural}.');
bulletAmount(10); // -> "У вас 10 патронов."
bulletAmount(1); // -> "У вас 1 патрон."
bulletAmount(3); // -> "У вас 3 патрона."
```

Both **plurals.js** and **plurals-independent.js** expose same two functions, difference is **plurals.js** works only in pretty recent Chrome versions and support both English and Russian; it requires `lang="en"` attribute on `<html>` to detect language. **plurals-independent.js** works pretty much everywhere but only supports Russian (should work with any Slavic language actually).

### qbn.js

Quest tracker, exposes `window.qbn` object. 

Suppose player should visit 5 rooms out of 7 in building before he can proceed with story, or examine 3 evidences out of 5 before character comes to conclusion. If character can visit rooms (and return to where they were before) or examine clues in random order, you'll need 7 (or 5) boolean variables and unmaintainable `if()` condition to allow that. You can put some flags into array, but this requires filtering out non-unique values. `qbn` helps with all that:
```js
qbn.set('house', 'ground floor');
qbn.set('house', ['basement', 'kitchen']);
if (qbn.length('house') === 3) { alert('house fully explored') }
qbn.set('house', 'ground floor'); // qbn.length('dungeon') still equals 2

// these methods more useful when tracking some character qualities (like in Sunless Sea)
qbn.unset('island', 'pleasant acquaintance'); 
qbn.inc('madness', 12); // time to eat your crew yet?
qbn.dec('madness', 5); // qbn.length('madness') === 7
```

## Using the code

Code in the repo uses pretty new JS language features and as-is will work only in fresh Chrome and FF and latest Safari. This is fine if you're wrapping your game in NW.js or Electron or during debug stages, but may be unacceptable for web distribution. To remedy that, use `bin/build.js` script like so:
```sh
node bin/build.js --es6 abbr about faint genderswitch
```

This will create `./bundle.js` combining transpiled `abbr.js`, `about.js` `faint.js` and `genderswitch.js` files. Additionally you can produce minified version adding `--compress` option:
```sh
node bin/build.js --es6 --compress abbr about faint genderswitch
```

By default code will be transpiled to support same browsers as SugarCube. If you don't have node.js installed, you can transpile code [online](http://babeljs.io/repl/).

## MIT License
Copyright 2017-2018 Konstantin Kitmanov.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

