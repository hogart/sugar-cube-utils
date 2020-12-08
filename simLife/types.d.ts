export type TimeInterval = [string, string];

export type Days = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri' | 'Sat' | 'Sun';

export type DaySchedule = Record<string, TimeInterval[] | string>;

export type WeekSchedule = Record<Days, DaySchedule>;

export type DistanceMap = Record<string, Record<string, number>>;

export interface NPC {
    id: string;
    location: string;
    schedule: WeekSchedule;
}

export interface SetupOptions {
    currentTime?: Date;
    distances: DistanceMap;
    NPCs: NPC[];
}