import { type TimeConfig } from '~/components/time_picker/date';
import { type ZoneInfo } from '~/components/zone/models';

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor?: string;
}

export interface RepeatConfig {
    every: number;
    unit:
        | {
              type: 'day';
          }
        // bit mask, 0b0000000, 0b0000001 is Monday, 0b1000000 is Sunday
        | {
              type: 'week';
              weekDays: number;
          }
        | {
              type: 'month';
              monthDay: number;
          }
        | {
              type: 'year';
              month: number;
              day: number;
          };
    end:
        | { type: 'count'; count: number }
        | { type: 'until'; until: Date }
        | { type: 'never' };
}

export interface ActivityDefinition {
    setting: ActivitySettingUnion;
    repeatConfig?: RepeatConfig;
}

export type ActivitySettingUnion = ActivitySetting<TaskSetting | EventSetting>;

export interface ActivitySetting<
    T extends TaskSetting | EventSetting | undefined
> {
    id: string;
    name: string;
    activityType: ActivityType;
    zones?: {
        include: ZoneInfo[];
        exclude: ZoneInfo[];
    };
    setting: T;
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

export type ActivityType = 'task' | 'event';
