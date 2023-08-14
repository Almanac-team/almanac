import { type ZoneInfo } from '~/components/zone/models';
import { type ActivitySetting } from '~/components/activity/models';
import { convertTimeConfigToMinutes } from '~/components/time_picker/models';
import { type ScheduledBlock } from '~/components/zone-timeline/models';

function getNextWeekStart(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd;
}

export interface ScheduledEvent {
    id: string;
    activityId: string;
    start: Date;
    end: Date;
}

export type AbsEventActivitySetting = Omit<AbsActivitySetting, 'setting'> & {
    setting: { type: 'event'; value: AbsEventSetting };
};

export type AbsTaskActivitySetting = Omit<AbsActivitySetting, 'setting'> & {
    setting: { type: 'task'; value: AbsTaskSetting };
};

export interface AbsActivitySetting {
    id: string;
    zones?: {
        include: ZoneInfo[];
        exclude: ZoneInfo[];
    };
    setting:
        | { type: 'task'; value: AbsTaskSetting }
        | { type: 'event'; value: AbsEventSetting };
}

export interface AbsTaskSetting {
    at: Date;
    estimatedRequiredTime: number;
    softDeadline: Date;
    earliestStart: Date;
}

export interface AbsEventSetting {
    at: Date;
    estimatedRequiredTime: number;
    earliestStart: Date;
}

export function getDiff(start: Date, end: Date) {
    const diffInMs: number = end.getTime() - start.getTime();
    return diffInMs / 1000 / 60;
}

function checkConflict(
    newEvent: ScheduledEvent,
    sceduledEvents: ScheduledEvent[]
) {
    for (const event of sceduledEvents) {
        if (
            (event.start <= newEvent.start && newEvent.start <= event.end) ||
            (newEvent.start <= event.start && event.start <= newEvent.end)
        ) {
            return true;
        }
    }
    return false;
}

function createSleepEvents(startDate: Date): ScheduledEvent[] {
    const schedulableEventsList: ScheduledEvent[] = [];

    for (let i = 0; i < 7; i++) {
        const start = new Date(startDate);
        start.setDate(startDate.getDate() + i);
        start.setHours(22);
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        const end = new Date(start);

        const isLastDay = startDate.getDay() + i === 6;
        if (isLastDay) {
            end.setHours(23);
            end.setMinutes(59);
        } else {
            end.setDate(start.getDate() + 1);
            end.setHours(6);
            end.setMinutes(0);
        }

        const sleep: ScheduledEvent = {
            id: 'sleep',
            activityId: 'sleep',
            start: start,
            end: end,
        };
        schedulableEventsList.push(sleep);
    }

    return schedulableEventsList;
}

function splitActivities(activities: AbsActivitySetting[]) {
    const events: AbsEventActivitySetting[] = [];
    const tasks: AbsTaskActivitySetting[] = [];

    for (const activity of activities) {
        if (activity.setting.type === 'task') {
            tasks.push(activity as AbsTaskActivitySetting);
        } else {
            events.push(activity as AbsEventActivitySetting);
        }
    }

    return { events, tasks };
}

function createScheduledEventFromEvent(
    eventActivity: AbsEventActivitySetting,
    scheduledEvents: ScheduledEvent[]
): ScheduledEvent | null {
    const event = eventActivity.setting.value;

    const activity: ScheduledEvent = {
        id: '',
        activityId: eventActivity.id,
        start: event.at,
        end: new Date(event.at),
    };

    activity.end.setMinutes(
        event.at.getMinutes() + event.estimatedRequiredTime
    );

    if (checkConflict(activity, scheduledEvents)) {
        return null;
    } else {
        return activity;
    }
}

function createPartitionedTasksWithPriorityFromTasks(
    taskActivity: AbsTaskActivitySetting,
    scheduledEvents: ScheduledEvent[]
): [number, AbsTaskActivitySetting][] {
    const partitionedTasks: [number, AbsTaskActivitySetting][] = [];
    const taskSetting: AbsTaskSetting = taskActivity.setting.value;

    const allowedTime = getDiff(
        taskSetting.earliestStart,
        taskSetting.softDeadline
    );
    let overlapTime = 0;
    for (const scheduledEvent of scheduledEvents) {
        if (
            taskSetting.earliestStart <= scheduledEvent.start &&
            scheduledEvent.start <= taskSetting.softDeadline
        ) {
            overlapTime +=
                Math.min(
                    scheduledEvent.end.getTime(),
                    taskSetting.softDeadline.getTime()
                ) - scheduledEvent.start.getTime();
        } else if (
            taskSetting.earliestStart <= scheduledEvent.end &&
            scheduledEvent.end <= taskSetting.softDeadline
        ) {
            overlapTime +=
                scheduledEvent.end.getTime() -
                Math.max(
                    scheduledEvent.start.getTime(),
                    taskSetting.earliestStart.getTime()
                );
        }
    }

    const sectionCount = Math.floor(taskSetting.estimatedRequiredTime / 60);
    for (let i = 0; i < sectionCount; i++) {
        const tempActivity: AbsTaskActivitySetting = {
            ...taskActivity,
            setting: {
                type: 'task',
                value: {
                    ...taskSetting,
                    estimatedRequiredTime:
                        taskSetting.estimatedRequiredTime / sectionCount,
                },
            },
        };
        partitionedTasks.push([overlapTime / allowedTime, tempActivity]);
    }

    return partitionedTasks;
}

function sortScheduledEventsByStart(scheduledEvents: ScheduledEvent[]) {
    scheduledEvents.sort((a, b) => a.start.getTime() - b.start.getTime());
}

export function convertActivitiesToAbsActivities(
    activities: ActivitySetting[]
) {
    const absActivities: AbsActivitySetting[] = [];

    for (const activity of activities) {
        let absSetting:
            | { type: 'task'; value: AbsTaskSetting }
            | { type: 'event'; value: AbsEventSetting }
            | undefined = undefined;
        const setting = activity.setting;
        if (setting.type === 'task') {
            absSetting = {
                type: 'task',
                value: {
                    at: new Date(setting.value.at),
                    estimatedRequiredTime: setting.value.estimatedRequiredTime,
                    earliestStart: new Date(
                        setting.value.at.getTime() -
                            convertTimeConfigToMinutes(setting.value.startMod) *
                                60 *
                                1000
                    ),
                    softDeadline: new Date(
                        setting.value.at.getTime() -
                            convertTimeConfigToMinutes(
                                setting.value.deadlineMod
                            ) *
                                60 *
                                1000
                    ),
                },
            };
        } else {
            absSetting = {
                type: 'event',
                value: {
                    at: new Date(setting.value.at),
                    estimatedRequiredTime: setting.value.estimatedRequiredTime,
                    earliestStart: new Date(
                        setting.value.at.getTime() -
                            convertTimeConfigToMinutes(setting.value.startMod) *
                                60 *
                                1000
                    ),
                },
            };
        }

        absActivities.push({
            id: activity.id,
            setting: absSetting,
        });
    }

    return absActivities;
}

export function generateEvents(
    activities: AbsActivitySetting[],
    startDate: Date
): ScheduledEvent[] {
    const scheduledEvents: ScheduledEvent[] = [];

    const { events, tasks } = splitActivities(activities);

    for (const eventActivity of events) {
        const scheduledEvent = createScheduledEventFromEvent(
            eventActivity,
            scheduledEvents
        );

        if (scheduledEvent) {
            scheduledEvents.push(scheduledEvent);
            sortScheduledEventsByStart(scheduledEvents);
        } else {
            console.log('event conflict');
        }
    }

    scheduledEvents.push(...createSleepEvents(startDate));
    sortScheduledEventsByStart(scheduledEvents);

    const busyTasks: [number, AbsTaskActivitySetting][] = [];
    for (const taskActivity of tasks) {
        const newBusyTasks = createPartitionedTasksWithPriorityFromTasks(
            taskActivity,
            scheduledEvents
        );
        busyTasks.push(...newBusyTasks);
    }
    busyTasks.sort((a, b) => b[0] - a[0]);

    for (const activityTuple of busyTasks) {
        const task: AbsTaskSetting = activityTuple[1].setting.value;
        let found = false;
        for (let i = 0; i < scheduledEvents.length - 1; i++) {
            const currActivity = scheduledEvents[i];
            const nextActivity = scheduledEvents[i + 1];
            if (!currActivity || !nextActivity) break;
            if (
                currActivity.end <=
                    new Date(
                        task.at.getTime() -
                            task.estimatedRequiredTime * 60 * 1000
                    ) &&
                task.at <= nextActivity.start
            ) {
                const start: Date = new Date(currActivity.end.getTime());
                start.setMinutes(start.getMinutes() + 1);

                const end: Date = new Date(currActivity.end.getTime());
                end.setMinutes(end.getMinutes() + task.estimatedRequiredTime);
                const activity: ScheduledEvent = {
                    id: '',
                    activityId: activityTuple[1].id,
                    start: start,
                    end: end,
                };
                scheduledEvents.push(activity);
                sortScheduledEventsByStart(scheduledEvents);
                found = true;
                break;
            }
        }
        if (!found) {
            console.log('task conflict');
        }
    }
    return scheduledEvents.filter((activity) => activity.id !== 'sleep');
}

function idToColor(input: string): string {
    let hash = 0;
    for (let i = 0; i < input.length; i++) {
        const charCode = input.charCodeAt(i);
        hash = (hash << 5) - hash + charCode;
        hash |= 0; // Convert to 32-bit integer (bitwise OR with 0)
    }

    const hexCode = (hash >>> 0).toString(16).slice(0, 6);
    return `#${hexCode.padStart(6, '0')}`;
}

export function scheduledBlocksFromScheduledEvents(
    scheduledEvents: ScheduledEvent[],
    activitiesMap: Map<string, ActivitySetting>
): ScheduledBlock[] {
    const scheduledBlocks: ScheduledBlock[] = [];
    for (const scheduledEvent of scheduledEvents) {
        const a = activitiesMap.get(scheduledEvent.activityId)?.name;
        scheduledBlocks.push({
            id: scheduledEvent.id,
            color: idToColor(scheduledEvent.activityId),
            name:
                a !== undefined
                    ? a
                    : scheduledEvent.id === 'sleep'
                    ? 'Sleep'
                    : 'Unknown',
            date: scheduledEvent.start,
            hours:
                (scheduledEvent.end.getTime() -
                    scheduledEvent.start.getTime()) /
                1000 /
                60 /
                60,
        });
    }
    return scheduledBlocks;
}
