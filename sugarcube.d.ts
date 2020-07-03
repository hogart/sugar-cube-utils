/***********************************************************************************************************************

	sugarcube.d.ts — SugarCube v2 Ambient Module (last updated: 2020-07-02)

	Copyright © 2020 Thomas Michael Edwards <thomasmedwards@gmail.com>. All rights reserved.
	Use of this source code is governed by a BSD 2-clause "Simplified" License.

***********************************************************************************************************************/

/*******************************************************************************
    ECMAScript Native Type Extensions.
*******************************************************************************/

interface Array<T> {
    concatUnique(...items: ConcatArray<T>[]): T[];
    concatUnique(...items: (T | ConcatArray<T>)[]): T[];
    count(searchElement: T, fromIndex?: number): number;
    delete(...items: T[]): T[];
    deleteAt(...items: number[]): T[];
    deleteWith<S extends T>(predicate: (this: void, value: T, index: number, obj: T[]) => value is S, thisArg?: any): S[];
    deleteWith(predicate: (value: T, index: number, obj: T[]) => unknown, thisArg?: any): T[];
    first(): T | undefined;
    includesAll(...items: T[]): boolean;
    includesAny(...items: T[]): boolean;
    last(): T | undefined;
    pluck(): T | undefined;
    pluckMany(want: number): T[];
    pushUnique(...items: T[]): number;
    random(): T | undefined;
    randomMany(want: number): T[];
    shuffle(): this;
    unshiftUnique(...items: T[]): number;
}
interface JSON {
    reviveWrapper(codeString: string, reviveData?: any): string;
}
interface Math {
    clamp(value: number, min: number, max: number): number;
}
interface Number {
    clamp(min: number, max: number): number;
}
interface RegExp {
    escape(text: string): string;
}
interface String {
    count(searchString: string, fromIndex?: number): number;
    first(): string;
    format(format: string, ...args: any[]): string;
    last(): string;
    toLocaleUpperFirst(): string;
    toUpperFirst(): string;
}


/*******************************************************************************
    jQuery Extensions.
*******************************************************************************/

interface jQuery {
    ariaClick(handler: (...args: any[]) => unknown): this;
    ariaClick(options: object, handler: (...args: any[]) => unknown): this;
    ariaDisabled(state: boolean): this;
    ariaIsDisabled(): boolean;
    wiki(...sources: string[]): this;
}
interface JQueryStatic {
    wiki(...sources: string[]): void;
}


/*******************************************************************************
    SugarCube Helper Functions.
*******************************************************************************/

declare function clone(original: any): any;
declare function convertBreaks(source: HTMLElement | DocumentFragment): void;
declare function safeActiveElement(): HTMLElement | null;
// declare function setDisplayTitle(title: string): void;
declare function setPageElement(idOrElement: string | HTMLElement, titles: string | string[], defaultText?: string): void;
declare function throwError(place: HTMLElement | DocumentFragment, message: string, source: string): false;
declare function toStringOrDefault(value: any, defaultValue: any): string;


/*******************************************************************************
    SugarCube User Functions.
*******************************************************************************/

declare function either(...args: any[]): any;
declare function forget(key: string): void;
declare function hasVisited(passageNames: string | string[]): boolean;
declare function lastVisited(passageNames: string | string[]): number;
declare function importScripts(...args: (string | string[])[]): Promise<any>;
declare function importStyles(...args: (string | string[])[]): Promise<any>;
declare function memorize(key: string, value: any): void;
declare function passage(): string;
declare function previous(): string;
declare function random(max: number): number;
declare function random(min: number, max: number): number;
declare function randomFloat(max: number): number;
declare function randomFloat(min: number, max: number): number;
declare function recall(key: string, defaultValue?: any): any;
declare function tags(): string[];
declare function tags(...passageNames: (string | string[])[]): string[];
declare function temporary(): any;
declare function time(): number;
declare function turns(): number;
declare function variables(): any;
declare function visited(): number;
declare function visited(...passageNames: (string | string[])[]): number;
declare function visitedTags(tagsNames: string | string[]): number;


/*******************************************************************************
    SugarCube Modules.
*******************************************************************************/

interface BrowserInterface {
    ieVersion: null | number;
    isGecko: boolean;
    isIE: boolean;
    isMobile: {
        Android: boolean;
        BlackBerry: boolean;
        Opera: boolean;
        Windows: boolean;
        any(): boolean;
        iOS: boolean;
    };
    isOpera: boolean;
    isVivaldi: boolean;
    operaVersion: null | number;
    userAgent: string;
}

interface ConfigInterface {
    audio: {
        pauseOnFadeToZero: boolean;
        preloadMetadata: boolean;
    };
    history: {
        controls: boolean;
        maxStates: number;
    };
    macros: {
        ifAssignmentError: boolean;
        maxLoopIterations: number;
    };
    navigation: {
        override?(passageTitle: string): boolean;
    };
    passages: {
        descriptions:  true | object | ((this: PassageInterface) => void);
        displayTitles: boolean;
        nobr: boolean;
        onProcess(p: Pick<PassageInterface, 'tags' | 'text' | 'title'>): void;
        start: string;
        transitionOut?: string | number;
    };
    saves: {
        autoload: boolean | 'prompt' | (() => boolean);
        autosave: boolean | string[] | (() => boolean);
        id: string;
        isAllowed?(): boolean;
        onLoad?(save: SaveObject): void;
        onSave?(save: SaveObject): void;
        slots: number;
        version?: any;
    };
    ui: {
        stowBarInitially: boolean | number;
        updateStoryElements: boolean;
    };
    addVisitedLinkClass: boolean;
    cleanupWikifierOutput: boolean;
    debug: boolean;
    loadDelay: number;
}

type jQueryAppendArgs = string | HTMLElement | jQuery;

interface DialogOpenOptions {
    top?: number;
    opacity?: number;
}

interface DialogInterface {
    append(...content: jQueryAppendArgs[]): DialogInterface;
    body(): HTMLElement;
    close(): DialogInterface;
    isOpen(classes?: string): boolean;
    open(options?: DialogOpenOptions, closeFn?: () => void): DialogInterface;
    setup(title?: string, classes?: string): HTMLElement;
    wiki(wikiMarkup: string): DialogInterface;
}

interface EngineInterface {
    lastPlay: number;
    state: 'idle' | 'playing' | 'rendering';
    backward(): boolean;
    forward(): boolean;
    go(offset: number): boolean;
    goTo(index: number): boolean;
    isIdle(): boolean;
    isPlaying(): boolean;
    isRendering(): boolean;
    play(passageTitle: string, noHistory?: boolean): HTMLElement;
    restart(): void;
    show(): HTMLElement;
}

interface FullscreenInterface {
    element: HTMLElement | null;
    isEnabled(): boolean;
    isFullscreen(): boolean;
    request(options?: FullscreenOptions, requestedEl?: HTMLElement): Promise<any>;
    exit(): Promise<any>;
    toggle(options?: FullscreenOptions, requestedEl?: HTMLElement): Promise<any>;
    onChange(handlerFn: (ev: Event) => void, requestedEl?: HTMLElement): void;
    offChange(handlerFn?: (ev: Event) => void, requestedEl?: HTMLElement): void;
    onError(handlerFn: (ev: Event) => void, requestedEl?: HTMLElement): void;
    offError(handlerFn?: (ev: Event) => void, requestedEl?: HTMLElement): void;
}

interface HasInterface {
    audio: boolean;
    fileAPI: boolean;
    geolocation: boolean;
    mutationObserver: boolean;
    performance: boolean;
    touch: boolean;
    transitionEndEvent: string;
}

interface LoadScreenInterface {
    lock(): number;
    unlock(lockId: number): void;
}

interface StoryInterface {
    domId: string;
    ifId: string;
    title: string;
    get(title: string): PassageInterface;
    has(title: string): boolean;
    lookup(propertyName: keyof PassageInterface, searchValue: any, sortProperty?: keyof PassageInterface): PassageInterface[];
    lookupWith(predicate: (p: PassageInterface) => boolean): PassageInterface[];
}

interface PassageInterface {
    domId: string;
    tags: string[];
    text: string;
    title: string;
    description(): string;
    processText(): string;
}

interface MacroArgs extends Array<any> {
    full: string;
    raw: string;
}

interface MacroPayload {
    name: string;
    contents: string;
    args: MacroArgs;
}

type ContextPredicate = (ctx: MacroContext) => boolean;

interface MacroParser {
    matchLength: number;
    matchStart: number;
    matchText: string;
    nextMatch: number;
    options: {
        profile: string;
    };
    output: HTMLElement | DocumentFragment;
    source: string;
}

interface MacroContext {
    args: MacroArgs;
    error(message: string): false;
    output: HTMLElement | DocumentFragment;
    name: string;
    parent: null | MacroContext;
    parser: MacroParser;
    payload: null | MacroPayload[];
    self: MacroDefinition;
    contextHas(filter: ContextPredicate): boolean;
    contextSelect(filter: ContextPredicate): null | MacroContext;
    contextSelectAll(filter: ContextPredicate): MacroContext[];
    createShadowWrapper(callback: (ev: Event) => void, doneCallback?: (ev: Event) => void, startCallback?: (ev: Event) => void);
}

interface MacroDefinition {
    skipArgs?: boolean;
    tags?: string[] | null;
    handler(this: MacroContext): void;
}

interface MacroInterface {
    add(name: string, definition: MacroDefinition, deep?: boolean): void;
    delete(name: string): void;
    get(name: string): MacroDefinition;
    has(name: string): boolean;
}

interface SaveObject {
    id: string;
    state: SaveState;
    title: string;
    date: number;
    metadata?: any;
    version?: any;
}

interface SaveState {
    history: HistoryMoment[];
    index: number;
    expired?: string[];
    seed?: string;
}

interface HistoryMoment {
    title: string;
    variables: object;
    pull?: number;
}

interface SaveInterface {
    clear(): void;
    get(): SaveObject[];
    ok(): boolean;

    slots: {
        length: number;
        count(): number;
        delete(slot: number): void;
        get(slot: number): SaveObject;
        has(slot: number): boolean;
        isEmpty(): boolean;
        load(slot: number): void;
        ok(): boolean;
        save(slot: number, title?: string, metadata?: any): void;
    };

    autosave: {
        delete(): void;
        get(): SaveObject | null;
        has(): boolean;
        load(): void;
        ok(): boolean;
        save(title?: string, metadata?: any): void;
    };

    export(fileName?: string, metadata?: any): void;
    import(event: InputEvent): void;

    serialize(metadata?: any): void;
    deserialize(saveStr: string): any | null;
}

interface SettingBaseDefinition {
    label: string;
    desc?: string;
    default?: boolean;
    onInit(): void;
    onChange(): void;
}
interface SettingListDefinition extends SettingBaseDefinition {
    list: any[];
}
interface SettingRangeDefinition extends SettingBaseDefinition {
    min: number;
    max: number;
    step: number;
}

interface SettingInterface {
    addHeader(name: string, desc?: string): void;
    addToggle(name: string, definition: SettingBaseDefinition): void;
    addList(name: string, definition: SettingListDefinition): void;
    addRange(name: string, definition: SettingRangeDefinition): void;
    load(): void;
    reset(name: string): void;
    save(): void;
}

declare class AudioRunner {
    fade(duration: number, toVol: number, fromVol?: number): void;
    fadeIn(duration: number, fromVol?: number): void;
    fadeOut(duration: number, fromVol?: number): void;
    fadeStop(duration: number, fromVol?: number): void;
    load(): void;
    loop(): boolean;
    loop(state: boolean): AudioRunner;
    mute(state: boolean): AudioRunner;
    off(...args: any[]): AudioRunner;
    on(...args: any[]): AudioRunner;
    one(...args: any[]): AudioRunner;
    pause(): void;
    play(): void;
    playWhenAllowed(): void;
    time(seconds: number): AudioRunner;
    unload(): void;
    volume(level: number): AudioRunner;
}

declare class AudioList {
    duration(): number;
    fade(duration: number, toVol: number, fromVol?: number): Promise<any>;
    fadeIn(duration: number, fromVol?: number): Promise<any>;
    fadeOut(duration: number, fromVol?: number): Promise<any>;
    fadeStop(): void;
    isEnded(): boolean;
    isFading(): boolean;
    isPaused(): boolean;
    isPlaying(): boolean;
    isStopped(): boolean;
    load(): void;
    loop(): boolean;
    loop(state: boolean): void;
    mute(): boolean;
    mute(state: boolean): void;
    pause(): void;
    play(): Promise<any>;
    playWhenAllowed(): void;
    remaining(): number;
    shuffle(): boolean;
    shuffle(state: AudioList): void;
    skip(): void;
    stop(): void;
    time(): number;
    unload(): void;
    volume(): boolean;
    volume(level: number): AudioList;
}

declare class SimpleAudioTrack {
    clone(): SimpleAudioTrack;
    duration(): number;
    fade(duration: number, toVol: number, fromVol?: number): Promise<any>;
    fadeIn(duration: number, fromVol?: number): Promise<any>;
    fadeOut(duration: number, fromVol?: number): Promise<any>;
    fadeStop(): void;
    hasData(): boolean;
    hasMetadata(): boolean;
    hasNoData(): boolean;
    hasSomeData(): boolean;
    hasSource(): boolean;
    isEnded(): boolean;
    isFading(): boolean;
    isFailed(): boolean;
    isLoading(): boolean;
    isPaused(): boolean;
    isPlaying(): boolean;
    isSeeking(): boolean;
    isStopped(): boolean;
    isUnavailable(): boolean;
    isUnloaded(): boolean;
    load(): boolean;
    loop(): boolean;
    loop(state: boolean): SimpleAudioTrack;
    mute(): boolean;
    mute(state: boolean): SimpleAudioTrack;
    off(...args: any[]): SimpleAudioTrack;
    on(...args: any[]): SimpleAudioTrack;
    one(...args: any[]): SimpleAudioTrack;
    pause(): void;
    play(): Promise<any>;
    playWhenAllowed(): void;
    remaining(): number;
    stop(): void;
    time(): number;
    time(seconds: number): SimpleAudioTrack;
    unload(): void;
    volume(): number;
    volume(level: number): SimpleAudioTrack;
}

type ListDescriptor = {
    id: string;
    own?: boolean;
    volume?: number;
} | {
    sources: string[];
    volume?: number;
}

interface SimpleAudioInterface {
    load(): void;
    loadWithScreen(): void;
    mute(): boolean;
    mute(state: boolean): void;
    muteOnHidden(): boolean;
    muteOnHidden(state: boolean): void;
    select(selector: string): AudioRunner | null;
    stop(): void;
    unload(): void;
    volume(): number;
    volume(level: number): void;

    tracks: {
        add(trackId: string, source: any | any[]);
        clear(): void;
        delete(trackId: string): void;
        get(trackId: string): SimpleAudioTrack;
        has(trackId: string): boolean;
    };

    groups: {
        add(groupId: string, ...trackIds: any): void;
        clear(): void;
        delete(groupId): void;
        get(groupId): AudioTrack[] | null;
        has(groupId): boolean;
    };

    lists: {
        add(listId: string, ...sources: ListDescriptor[]): void;
        clear(): void;
        delete(listId: string): void;
        get(listId: string): AudioList | null;
        has(listId: string): boolean;
    };
}

interface StateInterface {
    active: HistoryMoment;
    bottom: HistoryMoment;
    current: HistoryMoment;
    length: number;
    passage: string;
    size: number;
    temporary: object;
    top: HistoryMoment;
    turns: number;
    variables: object;
    getVar(varName: string): any;
    has(passageTitle: string): boolean;
    hasPlayed(passageTitle: string): boolean;
    index(index: number): HistoryMoment;
    isEmpty(): boolean;
    peek(offset?: number): HistoryMoment;

    metadata: {
        size: number;
        clear(): void;
        delete(key: string): void;
        get(key: string): any;
        has(key: string): boolean;
        set(key: string, value: any): void;
    };

    prng: {
        init(seed?: string, useEntropy?: boolean): void;
        isEnabled(): boolean;
        pull: number;
        seed: string | null;
    };
    random(): number;
    setVar(varName: string, value: any): boolean;

    /**
     * @deprecated
     */
    initPRNG(seed?: string, useEntropy?: boolean): void;
}

type TemplateDefinition = string | (() => string) | TemplateDefinition[];

interface TemplateInterface {
    size: number;
    add(name: string | string[], definition: TemplateDefinition): void;
    delete(name: void): void;
    get(name: string): TemplateDefinition | null;
    has(name: string): boolean;
}

interface VersionInterface {
    build: number;
    date: Date;
    extensions: Record<string, any>;
    long(): string;
    major: number;
    minor: number;
    patch: number;
    prerelease: any;
    short(): string;
    title: string;
}

interface UIInterface {
    alert(message: string, options?: DialogOpenOptions, closeFn?: () => void): void;
    jumpto(options?: DialogOpenOptions, closeFn?: () => void): void;
    restart(options?: DialogOpenOptions): void;
    saves(options?: DialogOpenOptions, closeFn?: () => void): void;
    settings(options?: DialogOpenOptions, closeFn?: () => void): void;
    share(options?: DialogOpenOptions, closeFn?: () => void): void;
}

interface UIBarInterface {
    destroy(): void;
    hide(): UIBarInterface;
    isHidden(): boolean;
    isStowed(): boolean;
    show(): UIBarInterface;
    stow(noAnimation?: boolean): UIBarInterface;
    unstow(noAnimation?: boolean): UIBarInterface;
}

declare var Browser: BrowserInterface;
declare var Config: ConfigInterface;
declare var Dialog: DialogInterface;
declare var Engine: EngineInterface;
declare var Fullscreen: FullscreenInterface;
declare var Has: HasInterface;
declare var LoadScreen: LoadScreenInterface;
declare var Macro: MacroInterface;
declare var Passage: PassageInterface;
declare var Save: SaveInterface;
declare var Setting: SettingInterface;
declare var SimpleAudio: SimpleAudioInterface;
declare var State: StateInterface;
declare var Story: StoryInterface;
declare var Template: TemplateInterface;
declare var UI: UIInterface;
declare var UIBar: UIBarInterface;


/*******************************************************************************
    SugarCube Variables.
*******************************************************************************/

type Task = Record<string, () => void>;

/** @deprecated */
declare var postdisplay: Task;
/** @deprecated */
declare var postrender: Task;
/** @deprecated */
declare var predisplay: Task;
/** @deprecated */
declare var prehistory: Task;
/** @deprecated */
declare var prerender: Task;

declare var session: any;
declare var settings: any;
declare var setup: any;
declare var storage: any;
declare var version: VersionInterface;
