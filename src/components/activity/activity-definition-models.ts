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
