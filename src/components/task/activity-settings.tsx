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

import activitySettingsStories from "~/components/task/activity-settings-time-config.stories";
import {ReactNode, useState} from "react";

export type TimeConfigUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export class TimeConfig {
    value = 0;
    unit: TimeConfigUnit = "hour";

    constructor(value: number, unit: TimeConfigUnit) {
        this.value = value;
        this.unit = unit;
    }
}

export interface ActivitySetting {
    id: string,
    name: string,
    at: Date,
    estimatedRequiredTime: TimeConfig,

    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

export enum ActivityType {
    Task,
    Event
}

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
                className="p-2 mr-2 border border-gray-300 rounded w-16"
            />
            <select className="p-2 border border-gray-300 rounded" onChange={(e) => {
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

export function ActivitySetting(props: { activityType: ActivityType, activitySetting: ActivitySetting }) {
    return (
        <div className="flex flex-col space-y-4 w-96 justify-center">
            <input
                type="text"
                value={props.activitySetting.name}
                className="p-2 mr-2 border-gray-300 border-b-2 focus:border-blue-500 focus:outline-none transition-colors"
            />

            <div className="w-full z-0 flex -space-x-px">
                <button
                    type="button"
                    className="w-full cursor-pointer select-none appearance-none items-center justify-center rounded-l border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Task
                </button>
                <button
                    type="button"
                    className="w-full cursor-pointer select-none appearance-none items-center justify-center rounded-r border border-gray-200 bg-white px-3 py-2 text-xs font-medium text-gray-800 transition hover:border-gray-300 hover:bg-gray-100 focus:z-10 focus:border-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-300">
                    Event
                </button>
            </div>

            <input
                type="datetime-local"
                value={props.activitySetting.at.toISOString().slice(0, 16)}
                className="p-2 mr-2 border border-gray-300 rounded"
            />

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
    );
}