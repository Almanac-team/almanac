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
    activityCompletions?: ActivityCompletions;
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
