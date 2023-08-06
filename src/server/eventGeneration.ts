import { type GeneratedEvent } from '~/pages/sprint';
import {
    type EventActivitySetting,
    type TaskActivitySetting,
} from '~/components/activity/models';

function getNextWeekStart(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd;
}

function findHardDeadlineTasks(
    tasks: TaskActivitySetting[],
    weekStart: Date
): TaskActivitySetting[] {
    const weekEnd = getNextWeekStart(weekStart);
    return tasks.filter((task) => task.setting.value.at < weekEnd);
}

export interface SchedulableEvents {
    id: string;
    activityId: string;

    softDeadline: Date;
    hardDeadline: Date;
    hours: number;
}

type ScheduledEvents = GeneratedEvent;

function scheduleEvent(
    existingEvents: ScheduledEvents[],
    newEvents: SchedulableEvents[]
): ScheduledEvents[] {
    return [];
}

function splitTasks(tasks: TaskActivitySetting[]): SchedulableEvents[] {
    const SchedulableEvents: SchedulableEvents[] = [];
    for (const task of tasks) {
        if (task.setting.value.estimatedRequiredTime > 1) {
            // split task into multiple events
        }
    }

    return [];
}

// main function
export function generateEvents(
    tasks: TaskActivitySetting[],
    events: EventActivitySetting[],
    weekStart: Date
): GeneratedEvent[] {
    const scheduledEvents: ScheduledEvents[] = [];

    // schedule hard deadline tasks first
    const splitHardDeadlineTasks = splitTasks(
        findHardDeadlineTasks(tasks, weekStart)
    );
    scheduledEvents.push(
        ...scheduleEvent(scheduledEvents, splitHardDeadlineTasks)
    );

    return scheduledEvents;
}
