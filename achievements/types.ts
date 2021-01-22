export interface IAchievement {
    id: string;
    title: string;
    description: string;
    check: () => boolean;
    unlocked: boolean;
    hidden: boolean;
    weight: number | null;
    date: Date | null;
}

export interface IAchievementOverview {
    locked: IAchievement[];
    unlocked: IAchievement[];
    hidden: number;
    weight: number;
}

export interface IStoredAchievement {
    id: string;
    date: Date | null;
}