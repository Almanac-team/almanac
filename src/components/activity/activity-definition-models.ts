import { type ActivityTemplate } from '~/components/activity/models';
import { convertTimeConfigToMillis } from '~/components/time_picker/models';

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

function repeatConfigToMillis(repeatConfig: RepeatConfig) {
    return convertTimeConfigToMillis({
        value: repeatConfig.every,
        unit: repeatConfig.unit.type,
    });
}

export type EndConfig =
    | { type: 'count'; count: number }
    | { type: 'until'; until: Date }
    | { type: 'never' };

interface RepeatingActivityException {
    id: string;
    data:
        | { type: 'skip' }
        | { type: 'override'; activityTemplate: ActivityTemplate };
}

export interface SingleActivity {
    type: 'single';
    activityTemplate: ActivityTemplate;
}

export interface RepeatingActivity {
    type: 'repeating';
    activityTemplate: ActivityTemplate;
    repeatConfig: RepeatConfig;
    endConfig: EndConfig;
    exceptions: Map<number, RepeatingActivityException>;
}

export interface ActivityDefinition {
    id: string;
    data: SingleActivity | RepeatingActivity;
    activityCompletions?: ActivityCompletions;
}

export function getIndexFromStartDate(
    startDate: Date,
    repeatingActivity: RepeatingActivity
) {
    if (
        repeatingActivity.endConfig.type === 'until' &&
        startDate > repeatingActivity.endConfig.until
    ) {
        return -1;
    }

    const index = Math.ceil(
        (startDate.getTime() -
            repeatingActivity.activityTemplate.at.getTime()) /
            repeatConfigToMillis(repeatingActivity.repeatConfig)
    );

    if (index < 0) {
        return 0;
    } else if (
        repeatingActivity.endConfig.type === 'count' &&
        index >= repeatingActivity.endConfig.count
    ) {
        return -1;
    } else {
        return index;
    }
}

export function getActivityDefinitionRange(
    activityDefinition: ActivityDefinition
): { startDate: Date; endDate: Date | null } {
    // TODO: should return the earliest date this activity definition can be seen, and the latest date this activity definition can be seen

    // TODO: for now returns the first ever date and last ever date, but should be changed to improve indexing for pagination.

    // let startDate: Date;
    // let endDate: Date | null;
    //
    // const activityTemplate = activityDefinition.data.activityTemplate;
    //
    // let startDateTime =
    //     activityTemplate.setting.value.at.getTime() -
    //     convertTimeConfigToMillis(activityTemplate.setting.value.reminderMod);
    //
    // if (activityTemplate.setting.type === 'task') {
    //     startDateTime -= convertTimeConfigToMillis(
    //         activityTemplate.setting.value.deadlineMod
    //     );
    // }
    // startDate = new Date(startDateTime);
    //
    // if (activityDefinition.data.type === 'single') {
    // } else {
    //     if (activityDefinition.data.endConfig.type === 'count') {
    //         if (activityTemplate.setting.type === 'task') {
    //         }
    //     } else if (activityDefinition.data.endConfig.type === 'until') {
    //         endDate = activityDefinition.data.endConfig.until;
    //     } else {
    //         endDate = null;
    //     }
    // }
    // return { startDate, endDate };

    return { startDate: new Date(0), endDate: null };
}

export interface ActivityCompletions {
    latestFinishedIndex: number;
    exceptions: Set<number>;
}

export function computeActivityCompletionsDiff(
    activityCompletions: ActivityCompletions | null,
    index: number,
    completed: boolean
): {
    added: number[];
    removed: number[];
    newLatestFinishedIndex: number;
} {
    const latestFinishedIndex = activityCompletions?.latestFinishedIndex ?? -1;
    const exceptions = activityCompletions?.exceptions ?? new Set();

    const added: number[] = [];
    let removed: number[] = [];
    let newLatestFinishedIndex;

    if (completed) {
        if (index >= latestFinishedIndex) {
            newLatestFinishedIndex = index;
            for (let i = latestFinishedIndex + 1; i < index; i++) {
                added.push(i);
            }
            removed = Array.from(exceptions).filter(
                (num) => num >= latestFinishedIndex + 1 && num < index
            );
        } else if (exceptions.has(index)) {
            removed.push(index);
        }
    } else {
        if (index == latestFinishedIndex) {
            newLatestFinishedIndex = index - 1;
            for (let i = index - 1; i >= 0; i--) {
                if (exceptions.has(i)) {
                    removed.push(i);
                    newLatestFinishedIndex = i - 1;
                } else {
                    break;
                }
            }
        } else if (index < latestFinishedIndex) {
            if (!exceptions.has(index)) {
                added.push(index);
            }
        }
    }
    return {
        added,
        removed,
        newLatestFinishedIndex: newLatestFinishedIndex ?? latestFinishedIndex,
    };
}
