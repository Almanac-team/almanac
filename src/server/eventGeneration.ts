import {type ActivitySetting, type EventSetting, type TaskSetting} from "~/components/activity/activity-settings";
import {type GeneratedEvent} from "~/pages/sprint";

function getNextWeekStart(weekStart: Date): Date {
    const weekEnd = new Date(weekStart);
    weekEnd.setDate(weekEnd.getDate() + 7);
    return weekEnd;
}

function findHardDeadlineTasks(tasks: ActivitySetting<TaskSetting>[], weekStart: Date): ActivitySetting<TaskSetting>[] {
    const weekEnd = getNextWeekStart(weekStart);
    return tasks.filter((task) => task.setting.at < weekEnd);
}

type DayDelta = number;
type HourDelta = number;

interface ExclusionZone {
    day: DayDelta,
    start: HourDelta,
    end: HourDelta,
}

type SchedulableEvents = GeneratedEvent;
type ScheduledEvents = GeneratedEvent;

function scheduleEvent(existingEvents: ScheduledEvents[], newEvents: SchedulableEvents[], exclusionZones: ExclusionZone[]): ScheduledEvents[] {
    return [];
}

function splitTasks(tasks: ActivitySetting<TaskSetting>[]): SchedulableEvents[] {
    return [];
}

export function generateEvents(tasks: ActivitySetting<TaskSetting>[], events: ActivitySetting<EventSetting>[], weekStart: Date): GeneratedEvent[] {
    const ExclusionZones: ExclusionZone[] = [
        {
            day: 0,
            start: 9,
            end: 9,
        },
        {
            day: 1,
            start: 9,
            end: 9,
        },
        {
            day: 2,
            start: 9,
            end: 9,
        },
        {
            day: 3,
            start: 9,
            end: 9,
        },
        {
            day: 4,
            start: 9,
            end: 9,
        },
        {
            day: 5,
            start: 9,
            end: 9,
        },
        {
            day: 6,
            start: 9,
            end: 9,
        }
    ]
    const scheduledEvents: ScheduledEvents[] = [];

    // schedule hard deadline tasks first
    const splitHardDeadlineTasks = splitTasks(findHardDeadlineTasks(tasks, weekStart));
    scheduledEvents.push(...scheduleEvent(scheduledEvents, splitHardDeadlineTasks, ExclusionZones));


    return scheduledEvents;
}