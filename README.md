# Collection of [SugarCube 2](http://www.motoslave.net/sugarcube/2/) macros and goodies

Please note that code will not work in older browsers as-is. See [Using the code](#using-the-code) section below.

## Macros

Most macros include built-in styles created by JS, so you can copy-paste one file instead of two. Styles are as unobtrusive and neutral as possible.

### `<<abbr "text" "tooltip content">>` and [`<<more "tooltip content">>text<</more>>`](./more.js)

**NB: `<<abbr>>` is deprecated, use `<<more>>`.**

`<<more>>` shows tooltip — on mouse hover on desktop and on tap on touch screen. It tries to contain tooltip entirely on the screen. `<<more>>` can include SugarCube code inside of it, but not in tooltip content.

### [`<<dlg>>`](./dlg.js), `<<level>>` and `<<line>>`.

`<<dlg>>` is split into `<<level>>`s and they consist of `<<line>>`s. It will show the player all lines from given level. After player chooses a line, line's content gets appended and next level is displayed.

```
::Start
— Hi!

<<dlg "dlg" 0 "➤">>\
	<<level 0>>\
		<<line "— How are you" "☺ ">>
			— Hi, how are you?
			— Everything's great! You?
		<</line>>
		<<line "— Hi!" "👋 ">>
			— Hi!
			— How are you?
		<</line>>
	<</level>>\
	<<level 1>>\
		<<line "— Things are tough" "😢 ">>
			— Things are tough, my pet hamster just died!:(
		<</line>>
		<<line "— Things are fine..." "❤ ">>
			— Things are fine, wanna hang out?
		<</line>>
		<<line "— Time to go...">>
			— Sry, playing new game, talk later!
		<</line>>
	<</level>>
<</dlg>>
```

#### `<<dlg>>`
`<<dlg>>` accepts 3 optional arguments:
* dialogue id (any unique string): needed only if there's several dialogues in the same passage.
* starting level (number): if you need to skip introductions. Defaults to 0.
* prefix (any string): will be prepended to each line. Empty string by default.

#### `<<level>>`
`<<level>>` accepts single numeric argument: it's level.

#### `<<line>>`
`<<line` accepts up to 3 arguments:
* line (any string, **mandatory**): short version of a text player character will say.
* prefix (any string, optional): (in)famous "wheel of emotions" kind of thingie prepended to a line, defaults to empty string.
* level (number, optional): `<<level>>` to show after this line, defaults to next level.
`<<line>>` is a container macro; it's content is displayed to player after they choose given line.

Use variables and `<<if>>`s to create branching.

### [`<<gender>>` and `<<genderswitch>>`](./genderswitch.js)

English grammar is pretty neutral when it comes to gender, but other languages are less forgiving. For instance, in Slavic languages you need to put adjectives and past tense verbs in proper grammatical gender.

`<<genderswitch>>` displays link-like text which user can click to switch between genders:
`My name is <<genderswitch $isFemale "Mary" "John">> Watson.`. Please note that you need to declare `$isFemale` variable in `StoryInit`.

`<<gender>>` chooses text between female and male version: `Your father says: My dear <<gender "daughter" "son">>!`. `<<genderswitch>>` assigns `gender-f` and `gender-m` classes to `html` element, so `<<gender>>` displays changes reactively, and you can use these classes to further customise game look should you need that.

This can also be used to tell a story from perspectives of two persons regardless of grammatical gender.

### [`<<hubnav>>`](./hubnav.js)

Easy navigation for set of interconnected locations. Imagine house consisting of bedroom, bathroom, living room, garage and kitchen. Each room has links to other ones but not on itself. Throw in some links that are displayed conditionally and there's whole mess on your hands. `<<hubnav>>` to the rescue!
```
::_home navigation
<<hubnav
    [[Bedroom]]
    [[Bathroom]]
    [[Living room]]
    [[Garage]]
    [[Kitchen]]
    [[Back yard]] `$day`
>>
<!-- Back yard link will only show at daytime -->

::Bedroom
Spacious bedroom.
<<include [[_home navigation]]>>

::Bathroom
Take a shower to gain energy. Take a bath to calm down.
<<include [[_home navigation]]>>

::Living room
Your collection of game consoles and huge flatscreen TV.
<<include [[_home navigation]]>>

::Garage
You bought this Vespa trading in retro games.
<<include [[_home navigation]]>>

::Kitchen
Clean, squeky clean, operating room clean.
<<include [[_home navigation]]>>

::Back yard
Daylight keeps vampires at bay. You don't go here at night.
<<include [[_home navigation]]>>
```

Now it's easy to add/delete/rename rooms and change conditions.

#### Tag-based navigation

Even easier option is to pass a string as single argument. `<<hubnav>>` will build navigation based on passages marked with given tag. You can't display link conditionally in this case.

```
::Bedroom [house]
Spacious bedroom.

::Bathroom [house]
Take a shower to gain energy. Take a bath to calm down.

::Living room [house]
Your collection of game consoles and huge flatscreen TV.

::Garage [house]
You bought this Vespa trading in retro games.

::Kitchen [house]
Clean, squeky clean, operating room clean.
```

### [`<<iconcheck>>`](./iconcheckbox.js)

Default checkboxes can look ugly and not fit into overall visual style. So `<<iconcheck>>` displays neat switch icon in the same style as built-in SugarCube controls.
Simplest form is `<<iconcheck $isSomething>>toggle value<</iconcheck>>`, this will display same label no matter what the value is.
Most flexible form looks like this and allows you to run some callback when value changes:
```
<<set _handler = function (value) { alert(value ? 'You turned it on!' : 'You turned it off!') }
<<iconcheck $isSomething "Turn on" "Turn off" _handler>><</iconcheck>>
```

### [`<<journaladd>>`, `<<journaldisplay>>` and `<<journalreplace>>`](./journal.js)

Journals/logs/notes/codexes are found in many games.

```
<<journaladd "Santa Claus" "characters">>Lives on North Pole (this is journal entry content)<</journaladd>>
<<journaladd "Santa Claus" "characters">>Has 4 reindeers<</journaladd>>
<<journaldisplay "Santa Claus" "characters">>Gift giver (this serves as optional title)<</journaldisplay>>
<!-- renders all entries in order they were entered -->

<<journalreplace "Santa Claus" "characters">>Doesn't exist!!!<</journalreplace>>
<<journaldisplay "Santa Claus" "characters">><</journaldisplay>>
<!-- Will now show only one entry -->

<<journalreplace "Santa Claus" "characters" true>>(Nothing will be shown when journaldisplay called)<</journalreplace>>
<!-- Note that you need to have exactly 3 arguments for this to work -->

All arguments are optional and defaults to empty strings
<<journaladd "Santa Claus">>Have all journal entries in one place<</journaladd>>
<<journalreplace "Santa Claus" "">><</journalreplace>>

Entries content gets rendered when <<journaldisplay>> is used, not when they are added:
<<set $melike = "pies">>
<<journaladd>>I like $melike!<</journaladd>>
<<set $melike = "ice cream">>
<<journaldisplay>>Me<</journaldisplay>>
<!-- Shows I like ice cream -->
```

This can also serve as a simple inventory system.

### [``<<linkif [[text|Passage]] `expression`>>``](./linkif.js)

Functionally identical to native [`<<link>>`](http://www.motoslave.net/sugarcube/2/docs/#macros-macro-link), except it's only clickable if second argument is truthy, and just shows plain text otherwise.

```
::Room
There's closed <<linkif [[chest|Chest]] $key>><</link>>. There's also <<linkif [[cupboard|Cupboard]] `!$key`>><</linkif>>.

::Cupboard
There's key here!
<<set $key = true>>
<<back>>
```

Supports any **wiki** form of `[[link|Passage]]`.

### [`<<linkonce [[text|Passage]]>>`](./linkonce.js)

Functionally identical to ``<<linkif [[text|Some passage]] `!visited('Some passage')`>>``: shows link if only given passage haven't been visited in current playthrough. Supports any **wiki** form of `[[link|Passage]]`.


### [`<<rumble>>`](./rumble.js)

Makes your device vibrate, and does nothing if browser/device doesn't [support](https://caniuse.com/#feat=vibration) [Vibration API](https://developer.mozilla.org/docs/Web/API/Navigator/vibrate). Please keep in mind that support is spotty (mostly Android and iOS Chrome and Firefox, no gamepads at all), and long vibrations or sequences can be chopped or dropped entirely, so don't rely on it to convey critical parts of story. Also be polite and provide players with means to turn it off completely.

```
<<rumble 100>> <!-- single vibration pulse -->
<<rumble 100, 200, 100, 500>> <!-- sequence of vibration and pauses -->
<<rumble stop>> or <<rumble 0>> <!-- stop vibrating immedeatly -->
```

Some browsers require user interaction to vibrate, so you'll probably need to wrap this in `<<link>>`.

## Goodies

Most goodies/utils put functions into `window.scUtils` "namespace". Things that create buttons in UIBar rely on `menuButton.js`, so include it in your script before.


### [`menuButton.js`](./menuButton.js)

Provide `scUtils.createPassageButton(label, iconContent, passageName)` and `scUtils.createHandlerButton(label, iconContent, shortName, handler)` functions. First one creates button which displays dialogue window displaying some passage content.

### [`about.js`](./about.js) (relies on menuButton.js)

If story have passage titled `StoryAbout`, adds "About" button which displays dialogue window with this passage rendered inside. Good for providing links to your website/patreon and attributing used assets. To change button label, assign value to correspondent l10n key:`l10nStrings.uiBarAbout = 'Who made this wonderful game?'`

### [`daymode.js`](./daymode.js) and [`daymode.css`](./daymode.css) (relies on menuButton.js)

Depending on players reading habits, level of fatigue, device, environment and other things author can't predict it can be strainous for eyes to read both white on black or black on white. So let them invert theme when they see fit. Daymode switches your game between default (white on black) theme and (slightly adapted) official but not included bleached.css.

### [`faint.js`](./faint.js)

Exposes `scUtils.faint(callback, duration, color, blur)` function, which fills screen with solid `color`, `blur`ring content at the same time and calls `callback` after `duration` seconds. Default values are `faint(callback = null, duration = 5, color = 'black', blur = true)`. Keep in mind that not all browsers support this blurring.

Useful for emulating loosing conscience, teleportation, extended periods of time passing, etc.

### [`fontSize.js`](./fontSize.js) (relies on menuButton.js)

Exposes `scUtils.createFontSizeBtn` function. When called this function creates buttons in sidebar to increase/decrease font size. To change button label, assign value to correspondent l10n key:`l10nStrings.uiFontSize = 'Zoom in/out'` (defaults to 'Font size').

### [`fullscreen.js`](./fullscreen.js) (relies on menuButton.js)

Adds "Full screen" button switch to UIBar (if browser supports this API). Supposedly increases immersion. To change button label, assign value to correspondent l10n key:`l10nStrings.uiFullScreen = 'Immersive mode'`.

### [`LocationFinder.js`](./LocationFinder.js)

Game can consist of different locations. Suppose you want to change some styles and switch background music depending on whether player is in dungeon, forest or desert. Using vanilla SugarCube you'll need to assign designated tag to every passage in each location (and 100 passages is not a very big game). Now add music to equation and remember that player can save/load and use checkpoints.

`scUtils.LocationFinder` tries to solve this issue.
0. Tag passages where player enters new locations with `locationName-desert` and `locationOrder-0`, `locationName-forest` and `locationOrder-1`, and so on. `locationOrder-` should have numbers according to how player supposed to move through story.
0. Call `window.finder = new scUtils.LocationFinder(onChange, 'location-', passageEvents)` in `StoryInit` or in game JavaScript.
    0. `onChange` is optional handler which will be called each time location changes, and is passed `newLocation` and `oldLocation` arguments. You can pass `null` if you don't need this.
    0. `'location-'` is optional prefix to CSS class which will be assigned to `html` according to current location. If you don't need this behavior, pass `null` instead.
    0. `passageEvents` is optional object, mapping [passage events](http://www.motoslave.net/sugarcube/2/docs/passage-events-task-objects.html#passage-events) to handlers (`{':passagestart'(location, event) { console.log(location) }}`). Each handler will receive current location as first argument and original event as second, so you can do some pretty advanced stuff in there.

Same location name can be used several times throughout the story, but each time it should have different `locationOrder-` tag. Unfortunately, at the moment LocationFinder won't properly work in non-linear, open-world games where player can freely move around some map.

### [`mute.js`](./mute.js) (relies on menuButton.js)

**NB: Deprecated, use [volumeButtons.js](#volume-buttons)**

Adds "Sound" button switch to UIBar, which mutes/unmutes SugarCube audio engine (note id doesn't stop playback). To change button label, assign value to correspondent l10n key:`l10nStrings.uiBarMute = 'Shut up'`.

### [`pickUnique.js`](pickUnique.js)

[`<Array>.random()`](http://www.motoslave.net/sugarcube/2/docs/#methods-array-prototype-method-random) is a great tool, but sometimes returns same result several times in a row. These helpers solve this problem: each result is guaranteed to be different from previous
```js
// No same food for two days in a row!
const todayIPick = scUtils.pickUnique(['Apple pie', 'Pizza', 'Ice cream', 'Berries']);

// Create a picker function
const foodPicker = scUtils.createUniquePicker(['Apple pie', 'Pizza', 'Ice cream', 'Berries']);
foodPicker(); // function which returns non-repeating results
```

Take a passage, split it into lines and use this lines to produce random non-repeating results. Useful if you have huge list or the list has long lines.

```
::Script [script]
const picker = scUtils.createUniquePickerFromPassage('Foods')

:: Foods
Apple pie
Pizza
Ice cream
Berries
```

### [`plurals.js`](./plurals.js) and [`plurals-independent.js`](./plurals-independent.js)

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

### [`preloadImages.js`](./preloadImages.js)

If your logo or background image is heavy, it may take some time to load for a player, resulting in unpleasant effect. You may wish to load images beforehand; `scUtils.preloadImages` shows load screen during this process. It also returns a `Promise` for a finer control on what happens next.
```js
scUtils.preloadImages(['img/heavy-background.jsp', 'img/huge-logo.png']).then(() => console.log('Images loaded!'));
```

### [`promiseLock.js`](./promiseLock.js)

If you need to load heave scripts, styles, images or other assets, it may be good idea to show load screen during the process. `window.scUtils.promiseLock` accepts a `Promise` object and shows load screen until the promise resolves successfully.


### [`qbn.js`](./qbn.js)

Quest tracker, exposes `window.qbn` and `window.scUtils.qbn` objects.

Suppose player should visit any 5 rooms out of 7 in building before he can proceed with story, or examine any3 evidences out of 5 before character comes to conclusion. If character can visit rooms (and return to where they were before) or examine clues in random order, you'll need 7 (or 5) boolean variables and unmaintainable `if()` condition to allow that. You can put some flags into array, but this requires filtering out non-unique values. `qbn` helps with all that:
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

### [`volumeButtons.js`](./volumeButtons.js) (relies on menuButton.js) {#volume-buttons}

Exposes `scUtils.createVolumeButtons` function, which adds volume control buttons to the UI bar. To change button label, assign value to correspondent l10n key:`l10nStrings.uiVolumeControl = 'Level of AWESOME'`.

```js
const step = 0.2; // volume changes from 0 to 1.
const labels = ['🔈', '🔇', '🔊'];
scUtils.createVolumeButtons(step, volume);
```

## Using the code {#using-the-code}

Code in the repo uses pretty new JS language features and as-is will work only in fresh Chrome and FF and latest Safari (last 2-3 years). This is fine if you're wrapping your game in NW.js or Electron or during debug stages, but may be unacceptable for web distribution. To remedy that, use `bin/build.js` script like so:
```sh
node bin/build.js --es6 abbr about faint genderswitch
```

This will create `./bundle.js` combining transpiled `abbr.js`, `about.js` `faint.js` and `genderswitch.js` files. Additionally you can produce minified version adding `--compress` option:
```sh
node bin/build.js --es6 --compress abbr about faint genderswitch
```

By default code will be transpiled to support same browsers as SugarCube. If you don't have node.js installed, you can transpile code [online](http://babeljs.io/repl/).

## MIT License
Copyright 2017-2020 Konstantin Kitmanov.

Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated documentation files (the "Software"), to deal in the Software without restriction, including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

