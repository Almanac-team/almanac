import { type ZoneInfo } from '~/components/zone/models';
import { type TimeConfig } from '~/components/time_picker/models';

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor?: string;
}

export type TaskActivitySetting = Omit<ActivitySetting, 'setting'> & {
    setting: { type: 'task'; value: TaskSetting };
};

export type EventActivitySetting = Omit<ActivitySetting, 'setting'> & {
    setting: { type: 'event'; value: EventSetting };
};

export type InnerSetting =
    | { type: 'task'; value: TaskSetting }
    | { type: 'event'; value: EventSetting };

export interface ActivityTemplate {
    name: string;
    at: Date;
    setting: InnerSetting;
}

export interface ActivitySetting {
    id: string;
    name: string;
    zones?: {
        include: ZoneInfo[];
        exclude: ZoneInfo[];
    };
    setting: InnerSetting;
}

export interface TaskSetting {
    at: Date;
    estimatedRequiredTime: number;
    deadlineMod: TimeConfig;
    reminderMod: TimeConfig;
    startMod: TimeConfig;
}

export interface EventSetting {
    at: Date;
    estimatedRequiredTime: number;
    reminderMod: TimeConfig;
    startMod: TimeConfig;
}
