import {
    type ActivitySetting,
    type ActivitySettingUnion,
    type EventSetting,
    type TaskSetting,
} from '~/components/activity/models';

export type RepeatSetting =
    | { type: 'single' }
    | {
          type: 'repeating';
          repeatConfig: RepeatConfig;
          endConfig: EndConfig;
      };

export interface RepeatConfig {
    every: number;
    unit:
        | {
              type: 'day';
          }
        // bit mask, 0b0000000, 0b0000001 is Sunday, 0b1000000 is Saturday
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
}

export type EndConfig =
    | { type: 'count'; count: number }
    | { type: 'until'; until: Date }
    | { type: 'never' };

export type ActivityDefinitionUnion = ActivityDefinition<
    TaskSetting | EventSetting
>;

interface RepeatingActivityException<T extends TaskSetting | EventSetting> {
    id: string;
    data:
        | { type: 'skip' }
        | { type: 'override'; activitySetting: ActivitySetting<T> };
}

export interface SingleActivity<T extends TaskSetting | EventSetting> {
    type: 'single';
    activitySetting: ActivitySetting<T>;
}

// export function changeActivity<T extends TaskSetting | EventSetting>(
//     repeatingActivity: RepeatingActivity<T>,
//     index: number,
//     activity: ActivitySetting<T>
// ): RepeatingActivity<T> {
//     if (index === 0) {
//         if (repeatingActivity.repeatingGroups[0]) {
//             const copy = [...repeatingActivity.repeatingGroups];
//             copy[0] = {
//                 ...repeatingActivity.repeatingGroups[0],
//                 data: activity,
//             };
//
//             return {
//                 ...repeatingActivity,
//                 repeatingGroups: copy,
//             };
//         }
//     }
//     return repeatingActivity;
// }

export interface RepeatingActivity<T extends TaskSetting | EventSetting> {
    type: 'repeating';
    activitySetting: ActivitySetting<T>;
    repeatConfig: RepeatConfig;
    endConfig: EndConfig;
    exceptions: Map<number, RepeatingActivityException<T>>;
}

export interface ActivityDefinition<T extends TaskSetting | EventSetting> {
    id: string;
    data: SingleActivity<T> | RepeatingActivity<T>;
}

function checkGenerationViolation(
    virtualActivity: ActivitySettingUnion,
    count: number,
    end: EndConfig
) {
    switch (end.type) {
        case 'count':
            if (count > end.count) {
                return true;
            }
            break;
        case 'until':
            if (virtualActivity.setting.at >= end.until) {
                return true;
            }
            break;
        case 'never':
            return false;
    }
    return false;
}

export function generateVirtualActivities<T extends TaskSetting | EventSetting>(
    count: number,
    repeatingActivity: RepeatingActivity<T>
): ActivitySetting<T>[] {
    const activitySettings: ActivitySetting<T>[] = [];

    const repeatConfig = repeatingActivity.repeatConfig;
    const end = repeatingActivity.endConfig;

    for (let i = 0; i < count; i++) {
        const activitySetting: ActivitySetting<T> = {
            ...repeatingActivity.activitySetting,
            id: `virtual-${activitySettings.length}`,
        };

        let multiplier = 1;
        switch (repeatConfig.unit.type) {
            case 'day':
                multiplier = 24 * 60 * 60 * 1000;
                break;
            case 'week':
                // TODO: choosing the next activity occurrence is more difficult, for now just assume
                multiplier = 24 * 60 * 60 * 1000 * 7;
                break;
            case 'month':
                multiplier = 24 * 60 * 60 * 1000 * 30;
                break;
            case 'year':
                multiplier = 24 * 60 * 60 * 1000 * 365;
                break;
        }

        activitySetting.setting = {
            ...activitySetting.setting,
            at: new Date(
                repeatingActivity.activitySetting.setting.at.getTime() +
                    i * repeatingActivity.repeatConfig.every * multiplier
            ),
        };
        if (
            checkGenerationViolation(
                activitySetting,
                activitySettings.length + 1,
                end
            )
        ) {
            return activitySettings;
        } else {
            activitySettings.push(activitySetting);
        }
    }
    return activitySettings;
}
