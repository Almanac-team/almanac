import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
} from '~/components/activity/models';
import {
    type ActivityCompletions,
    type ActivityDefinition,
    type EndConfig,
    getIndexFromStartDate,
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
            if (virtualActivity.at >= end.until) {
                return true;
            }
            break;
        case 'never':
            return false;
    }
    return false;
}

function checkIfComplete(
    index: number,
    activityCompletions?: ActivityCompletions
) {
    if (!activityCompletions) {
        return false;
    }
    return (
        activityCompletions.latestFinishedIndex >= index &&
        !activityCompletions.exceptions.has(index)
    );
}

export type ActivitySettingWithCompletion = ActivitySetting & {
    completed: boolean;
};

export function getActivitiesFromDefinition(
    activityDefinition: ActivityDefinition,
    end: { type: 'total'; count: number } | { type: 'until'; until: Date },
    start?: { type: 'skip'; count: number } | { type: 'from'; from: Date }
): ActivitySettingWithCompletion[] {
    const activityCompletion = activityDefinition.activityCompletions;
    if (activityDefinition.data.type === 'single') {
        return [
            {
                index: 0,
                ...activityDefinition.data.activityTemplate,
                completed: checkIfComplete(0, activityCompletion),
            },
        ];
    }
    const repeatingActivity = activityDefinition.data;

    const activitySettings: ActivitySettingWithCompletion[] = [];

    const repeatConfig = repeatingActivity.repeatConfig;
    const endConfig = repeatingActivity.endConfig;

    const startShift = (() => {
        if (!start) {
            return 0;
        }
        if (start.type === 'from') {
            return getIndexFromStartDate(start.from, repeatingActivity);
        } else {
            return start.count;
        }
    })();

    for (let i = startShift; true; i++) {
        const setting:
            | { type: 'task'; value: TaskSetting }
            | { type: 'event'; value: EventSetting } =
            repeatingActivity.activityTemplate.setting.type === 'task'
                ? {
                      type: 'task',
                      value: {
                          ...repeatingActivity.activityTemplate.setting.value,
                      },
                  }
                : {
                      type: 'event',
                      value: {
                          ...repeatingActivity.activityTemplate.setting.value,
                      },
                  };

        const activitySetting: ActivitySettingWithCompletion = {
            index: i,
            ...repeatingActivity.activityTemplate,
            setting,
            completed: checkIfComplete(i, activityCompletion),
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

        activitySetting.at = new Date(
            repeatingActivity.activityTemplate.at.getTime() +
                i * repeatingActivity.repeatConfig.every * multiplier
        );

        if (
            (end.type === 'total' && activitySettings.length >= end.count) ||
            (end.type === 'until' && activitySetting.at >= end.until) ||
            checkGenerationViolation(
                activitySetting,
                activitySettings.length + 1,
                endConfig
            )
        ) {
            return activitySettings;
        } else {
            activitySettings.push(activitySetting);
        }
    }
}
