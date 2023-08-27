import { type ZoneInfo } from '~/components/zone/models';
import { type TimeConfig } from '~/components/time_picker/models';

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor?: string;
}

export interface BaseActivity {
    index: number;
    name: string;
    at: Date;
}

export interface TaskEnum {
    type: 'task';
    value: TaskSetting;
}

export interface EventEnum {
    type: 'event';
    value: EventSetting;
}

export type TaskActivitySetting = BaseActivity & {
    setting: TaskEnum;
};

export type EventActivitySetting = BaseActivity & {
    setting: EventEnum;
};

export type ActivitySetting = BaseActivity & {
    setting: TaskEnum | EventEnum;
};

export interface BaseActivityTemplate {
    name: string;
    at: Date;
}

export type TaskActivityTemplate = BaseActivityTemplate & {
    setting: TaskEnum;
};

export type EventActivityTemplate = BaseActivityTemplate & {
    setting: EventEnum;
};

export type ActivityTemplate = BaseActivityTemplate & {
    setting: TaskEnum | EventEnum;
};

export interface TaskSetting {
    estimatedRequiredTime: number;
    deadlineMod: TimeConfig;
    reminderMod: TimeConfig;
    startMod: TimeConfig;
}

export interface EventSetting {
    estimatedRequiredTime: number;
    reminderMod: TimeConfig;
    startMod: TimeConfig;
}
