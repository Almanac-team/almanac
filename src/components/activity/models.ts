import {TimeConfig} from "~/components/time_picker/date";
import {ZoneInfo} from "~/components/zone/models";

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor?: string;
}

export type ActivitySettingUnion = ActivitySetting<TaskSetting | EventSetting | undefined>;

export interface ActivitySetting<T extends TaskSetting | EventSetting | undefined> {
    id: string,
    name: string,
    activityType: ActivityType,
    zones: ZoneInfo[] | undefined,
    setting: T
}

export interface TaskSetting {
    at: Date,
    estimatedRequiredTime: number,
    deadlineMod: TimeConfig,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

export interface EventSetting {
    at: Date,
    estimatedRequiredTime: number,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

export type ActivityType = 'task' | 'event';