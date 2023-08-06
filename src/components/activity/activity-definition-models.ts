import { type ActivitySetting } from '~/components/activity/models';

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

interface RepeatingActivityException {
    id: string;
    data:
        | { type: 'skip' }
        | { type: 'override'; activitySetting: ActivitySetting };
}

export interface SingleActivity {
    type: 'single';
    activitySetting: ActivitySetting;
}

export interface RepeatingActivity {
    type: 'repeating';
    activitySetting: ActivitySetting;
    repeatConfig: RepeatConfig;
    endConfig: EndConfig;
    exceptions: Map<number, RepeatingActivityException>;
}

export interface ActivityDefinition {
    id: string;
    data: SingleActivity | RepeatingActivity;
}

function checkGenerationViolation(
    virtualActivity: ActivitySetting,
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
            if (virtualActivity.setting.value.at >= end.until) {
                return true;
            }
            break;
        case 'never':
            return false;
    }
    return false;
}

export function generateVirtualActivities(
    count: number,
    repeatingActivity: RepeatingActivity
): ActivitySetting[] {
    const activitySettings: ActivitySetting[] = [];

    const repeatConfig = repeatingActivity.repeatConfig;
    const end = repeatingActivity.endConfig;

    for (let i = 0; i < count; i++) {
        const activitySetting: ActivitySetting = {
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

        activitySetting.setting.value = {
            ...activitySetting.setting.value,
            at: new Date(
                repeatingActivity.activitySetting.setting.value.at.getTime() +
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
