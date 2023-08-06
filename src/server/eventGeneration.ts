import { type GeneratedEvent } from '~/pages/sprint';
import {
    type EventActivitySetting,
    type TaskActivitySetting,
} from '~/components/activity/models';

import { convertTimeConfigToInt } from "~/server/api/routers/activityDefinitions";
import { type TimeConfig } from '~/components/time_picker/date';
import { ZoneInfo } from '~/components/zone/models';

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
    start: Date;
    end: Date;
}

type ScheduledEvents = GeneratedEvent;

export interface AbsActivitySetting {
    id: string;
    name: string;
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
    deadlineMod: Date;
    startMod: Date;
}

export interface AbsEventSetting {
    at: Date;
    estimatedRequiredTime: number;
    startMod: Date;
}

export function getDiff(start: Date, end: Date){
    const diffInMs: number = end.getTime()-start.getTime();
    const diffinMinutes: number = diffInMs/1000/60;
    return diffinMinutes;
}

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
// export function generateEvents(
//     tasks: TaskActivitySetting[],
//     events: EventActivitySetting[],
//     weekStart: Date
// ): GeneratedEvent[] {
//     const scheduledEvents: ScheduledEvents[] = [];

//     // schedule hard deadline tasks first
//     const splitHardDeadlineTasks = splitTasks(
//         findHardDeadlineTasks(tasks, weekStart)
//     );
//     scheduledEvents.push(
//         ...scheduleEvent(scheduledEvents, splitHardDeadlineTasks)
//     );

//     return scheduledEvents;
// }


export function generateEvents(activities: AbsActivitySetting[]): SchedulableEvents[] {
    function addActivityList (newEvent: SchedulableEvents) {
        for (const currEvent of schedulableEventsList){
            if ((currEvent.start <= newEvent.start && newEvent.start <= currEvent.end) 
            || (newEvent.start <= currEvent.start && currEvent.start <= newEvent.end)) {
                return false;
            }
        }
        schedulableEventsList.push(newEvent);
        schedulableEventsList.sort();
    }

    let schedulableEventsList: SchedulableEvents[] = [];


    const currentDate = new Date();
    const currentDayOfWeek = currentDate.getDay();
    for (let i = 0; i < 7; i++) {
        const start = new Date(currentDate);
        start.setDate(currentDate.getDate() + i);
        start.setHours(21); 
        start.setMinutes(0);
        start.setSeconds(0);
        start.setMilliseconds(0);
        const end = new Date(start);
        if ((currentDayOfWeek + i) % 7 === 0) {
            end.setHours(23);
            end.setMinutes(59);
        } else { 
            end.setDate(start.getDate() + 1);
            end.setHours(9);
            end.setMinutes(0);
        }
        const sleep: SchedulableEvents = {
            id: 'sleep',
            activityId: 'sleep',
            start: start,
            end: end
        }
        schedulableEventsList.push(sleep);
    }

    const events: AbsActivitySetting[] = [];
    const tasks: AbsActivitySetting[] = [];

    for (const activity of activities){
        if (activity.setting.type === "task"){
            tasks.push(activity);
        } else {
            events.push(activity);
        }
    }

    for (const Event of events){
        const event = Event.setting.value;
        const activity: SchedulableEvents = {
            id: "",
            activityId: Event.id,
            start: event.at,
            end: new Date(),
        }
        activity.end.setMinutes(event.at.getMinutes()+event.estimatedRequiredTime)
        if (!addActivityList(activity)){
            throw new Error("Events could not be scheduled")
        }
    }

    const busyTasks: [number, AbsActivitySetting][] = []
    for (const Activity of events){
        if (Activity.setting.type === 'task'){
            const task: AbsTaskSetting = Activity.setting.value;
            const tot = getDiff(task.startMod, task.deadlineMod)
            let use = 0;
            for (const schedulableEvent of schedulableEventsList) {
                if (task.startMod <= schedulableEvent.start && schedulableEvent.start <= task.deadlineMod) {
                    use += Math.min(schedulableEvent.end.getTime(), task.deadlineMod.getTime()) - schedulableEvent.start.getTime();
                }
                else if ( task.startMod <= schedulableEvent.end && schedulableEvent.end <= task.deadlineMod) {
                    use += schedulableEvent.end.getTime() - Math.max(schedulableEvent.start.getTime(), task.startMod.getTime());
                }
            }
            for (let i = 0; i<Math.floor(task.estimatedRequiredTime/60); i++){
                const tempActivity = Activity;
                tempActivity.setting.value.estimatedRequiredTime = 60;
                busyTasks.push([use/tot, tempActivity]);
            }
            const tempActivity = Activity;
            tempActivity.setting.value.estimatedRequiredTime = task.estimatedRequiredTime % 60;
            if (tempActivity.setting.value.estimatedRequiredTime){
                busyTasks.push([use/tot, tempActivity]);
            }
        } else {
            // this will never happen lmao
        }
    }
    busyTasks.sort();
    busyTasks.reverse();

    for (const activityTuple of busyTasks){
        if (activityTuple[1].setting.type === 'task'){
            const task: AbsTaskSetting = activityTuple[1].setting.value;
            let found = false;
            for (let i = 0; i < schedulableEventsList.length - 1; i++){
                const currActivity = schedulableEventsList[i];
                const nextActivity = schedulableEventsList[i+1];
                if (!currActivity || !nextActivity) break;
                if (currActivity.end <= task.startMod && task.at <= nextActivity.start){
                    const start: Date = new Date(currActivity.end.getTime());
                    start.setMinutes(start.getMinutes() + 1);

                    const end: Date = new Date(currActivity.end.getTime());
                    end.setMinutes(end.getMinutes() + task.estimatedRequiredTime);
                    const activity: SchedulableEvents = {
                        id: '',
                        activityId: activityTuple[1].id,
                        start:start,
                        end: end,
                    }
                    found = true;
                    break;
                } 
            }
            if (!found) {
                throw Error("task could not be scheduled!")
            }
        } else {
            // bruh
        }
    }
    schedulableEventsList = schedulableEventsList.filter((activity) => activity.id !== 'sleep')
    return schedulableEventsList;

}