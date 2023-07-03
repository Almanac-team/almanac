// enum RepeatType {
//     Never = 'never',
//     Daily = 'daily',
//     Weekly = 'weekly',
//     Monthly = 'monthly',
//     Yearly = 'yearly'
// }
//
// enum DayOfWeek {
//     Monday = 'monday',
//     Tuesday = 'tuesday',
//     Wednesday = 'wednesday',
//     Thursday = 'thursday',
//     Friday = 'friday',
//     Saturday = 'saturday',
//     Sunday = 'sunday'
// }
//
// enum RepeatEnd {
//     Never = 'never',
//     After = 'after',
//     On = 'on'
// }
//
// const MILLIS_IN_DAY = 1000 * 60 * 60 * 24;
//
// function monthDiff(dateFrom: Date, dateTo: Date) {
//     return dateTo.getMonth() - dateFrom.getMonth() +
//         (12 * (dateTo.getFullYear() - dateFrom.getFullYear()))
// }
//
// class RepeatOptions {
//     firstActivityDate: Date = new Date();
//
//     // Repeat every "repeatPeriod" days/weeks/months/years
//     repeatPeriod = 1
//     repeatType: RepeatType = RepeatType.Never;
//
//     repeatEnd: RepeatEnd = RepeatEnd.Never;
//     repeatEndAfter = 1;
//     repeatEndOn: Date = new Date();
//
//     setRepeatEvery(period: number, type: RepeatType) {
//         this.repeatPeriod = period;
//         this.repeatType = type;
//     }
//
//     setRepeatNever() {
//         this.repeatEnd = RepeatEnd.Never;
//     }
//
//     setRepeatEndAfter(after: number) {
//         this.repeatEnd = RepeatEnd.After;
//         this.repeatEndAfter = after;
//     }
//
//     setRepeatEndOn(date: Date) {
//         this.repeatEnd = RepeatEnd.On;
//         this.repeatEndOn = date;
//     }
//
//     getTotalRepeatCount() {
//         if (this.repeatEnd === RepeatEnd.Never) {
//             return -1;
//         } else if (this.repeatEnd === RepeatEnd.After) {
//             return this.repeatEndAfter;
//         }
//
//         if (this.repeatType === RepeatType.Never) {
//             return 1;
//         } else {
//             const firstTaskDate = new Date(this.firstActivityDate.getTime());
//             const repeatEndOn = new Date(this.repeatEndOn.getTime());
//
//             firstTaskDate.setHours(0, 0, 0, 0);
//             repeatEndOn.setHours(0, 0, 0, 0);
//
//             if (this.repeatType === RepeatType.Daily) {
//                 return Math.floor((repeatEndOn.getTime() - firstTaskDate.getTime() + 1) / MILLIS_IN_DAY / this.repeatPeriod);
//             } else if (this.repeatType === RepeatType.Weekly) {
//                 return Math.floor((repeatEndOn.getTime() - firstTaskDate.getTime() + 1) / MILLIS_IN_DAY / 7 / this.repeatPeriod);
//             }
//         }
//     }
//
//     getRepeatDate(i: number) {
//         if (this.repeatType === RepeatType.Never) {
//             return this.firstActivityDate;
//         } else {
//             const activityDate = new Date(this.firstActivityDate.getTime());
//             activityDate.setHours(0, 0, 0, 0);
//
//             if (this.repeatType === RepeatType.Daily) {
//                 activityDate.setDate(activityDate.getDate() + i * this.repeatPeriod);
//             } else if (this.repeatType === RepeatType.Weekly) {
//                 activityDate.setDate(activityDate.getDate() + i * this.repeatPeriod * 7);
//             }
//
//             return activityDate;
//         }
//
//
//     }
// }

import activitySettingsStories from "~/components/activity/activity-settings-time-config.stories";
import {ReactNode, useState} from "react";
import {Button, Select, Option, TabPanel, TabsBody, TabsHeader} from "@material-tailwind/react";
import {Tab, Tabs} from "~/components/activity/tab";

export type TimeConfigUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeConfig {
    value: number,
    unit: TimeConfigUnit
}

export interface ActivitySetting {
    id: string,
    name: string,
    at: Date,
    estimatedRequiredTime: TimeConfig,
    deadlineMod: TimeConfig,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

// export abstract class ActivitySetting {
//     public id: string;
//     public name: string;
//     public at: Date;
//     public estimatedRequiredTime: TimeConfig;
//     public reminderMod: TimeConfig;
//     public startMod: TimeConfig;
//
//     protected constructor(id: string, name: string, at: Date, estimatedRequiredTime: TimeConfig, reminderMod: TimeConfig, startMod: TimeConfig) {
//         this.id = id;
//         this.name = name;
//         this.at = at;
//         this.estimatedRequiredTime = estimatedRequiredTime;
//         this.reminderMod = reminderMod;
//         this.startMod = startMod;
//     }
// }
//
// export class TaskSettingClass extends ActivitySetting {
//     public deadlineMod: TimeConfig;
//     constructor(id: string, name: string, at: Date, estimatedRequiredTime: TimeConfig, reminderMod: TimeConfig, startMod: TimeConfig, deadlineMod: TimeConfig) {
//         super(id, name, at, estimatedRequiredTime, reminderMod, startMod);
//         this.deadlineMod = deadlineMod;
//     }
// }



export type ActivityType = 'task' | 'event';

export function TimeConfigInput(props: {
    timeConfig: TimeConfig,
    onChange?: (value?: number, unit?: TimeConfigUnit) => void
}) {
    return (
        <div className="flex items-center">
            <input
                type="number"
                value={props.timeConfig.value}
                onChange={(e) => {
                    if (props.onChange) props.onChange(parseInt(e.target.value), undefined)
                }}
                className="p-2 mr-2 border border-gray-300 rounded w-16 h-full"
            />
            <select className="p-2 border border-gray-300 rounded h-full" value={props.timeConfig.unit} onChange={(e) => {
                if (props.onChange) props.onChange(undefined, e.target.value as TimeConfigUnit)
            }}>
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
                <option value="week">Weeks</option>
                <option value="month">Months</option>
                <option value="year">Years</option>
            </select>
        </div>
    )
}

function TaskSetting(props: { activitySetting: ActivitySetting }) {
    return (
        <div className="flex flex-col space-y-2">

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Due Date</span>
                <input
                    type="datetime-local"
                    value={props.activitySetting.at.toISOString().slice(0, 16)}
                    className="p-2 mr-2 border border-gray-300 rounded"
                />
            </div>


            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.activitySetting.estimatedRequiredTime}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Try and finish</span>
                <TimeConfigInput timeConfig={props.activitySetting.reminderMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.activitySetting.startMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.activitySetting.startMod}/>
                <span>before</span>
            </div>
        </div>
    )
}

function EventSetting(props: { activitySetting: ActivitySetting }) {
    return (
        <div className="flex flex-col space-y-2">

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>At</span>
                <input
                    type="datetime-local"
                    value={props.activitySetting.at.toISOString().slice(0, 16)}
                    className="p-2 mr-2 border border-gray-300 rounded"
                />
            </div>


            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.activitySetting.estimatedRequiredTime}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Try and finish</span>
                <TimeConfigInput timeConfig={props.activitySetting.reminderMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.activitySetting.startMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.activitySetting.startMod}/>
                <span>before</span>
            </div>
        </div>
    )
}

export function ActivitySetting(props: { activityType: ActivityType, activitySetting: ActivitySetting }) {
    return (
        <div className="flex flex-col space-y-2 w-96 justify-center">
            <input
                type="text"
                value={props.activitySetting.name}
                className="p-2 mr-2 border-gray-300 border-b-2 focus:border-blue-500 focus:outline-none transition-colors text-gray-700 text-xl"
            />

            <Tabs activeValue={props.activityType}>
                <Tab value="task">
                    Task
                </Tab>
                <Tab value="event">
                    Event
                </Tab>
            </Tabs>

            {props.activityType === 'task' ? <TaskSetting activitySetting={props.activitySetting}/> : <EventSetting activitySetting={props.activitySetting}/>}
        </div>
    );
}