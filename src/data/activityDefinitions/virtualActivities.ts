import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
} from '~/components/activity/models';
import {
    type EndConfig,
    type RepeatingActivity,
} from '~/components/activity/activity-definition-models';

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
    repeatingActivity: RepeatingActivity,
    count: number
): ActivitySetting[] {
    const activitySettings: ActivitySetting[] = [];

    const repeatConfig = repeatingActivity.repeatConfig;
    const end = repeatingActivity.endConfig;

    for (let i = 0; i < count; i++) {
        const setting:
            | { type: 'task'; value: TaskSetting }
            | { type: 'event'; value: EventSetting } =
            repeatingActivity.activitySetting.setting.type === 'task'
                ? {
                      type: 'task',
                      value: {
                          ...repeatingActivity.activitySetting.setting.value,
                      },
                  }
                : {
                      type: 'event',
                      value: {
                          ...repeatingActivity.activitySetting.setting.value,
                      },
                  };

        const activitySetting: ActivitySetting = {
            ...repeatingActivity.activitySetting,
            setting,
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

        activitySetting.setting.value.at = new Date(
            repeatingActivity.activitySetting.setting.value.at.getTime() +
                i * repeatingActivity.repeatConfig.every * multiplier
        );

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