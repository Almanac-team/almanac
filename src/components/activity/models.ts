import { type TimeConfig } from '~/components/time_picker/date';
import { type ZoneInfo } from '~/components/zone/models';

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

export interface ActivitySetting {
    id: string;
    name: string;
    zones?: {
        include: ZoneInfo[];
        exclude: ZoneInfo[];
    };
    setting:
        | { type: 'task'; value: TaskSetting }
        | { type: 'event'; value: EventSetting };
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
