import {Button} from "@material-tailwind/react";
import {Tab, Tabs} from "~/components/activity/tab";

export type TimeConfigUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeConfig {
    value: number,
    unit: TimeConfigUnit
}

export interface ActivitySetting {
    id: string,
    name: string,
    activityType: ActivityType,
    taskSetting: TaskSetting, // we keep both copies so data is not lost when switching between task and event
    eventSetting: EventSetting,
}

export interface TaskSetting {
    due: Date,
    estimatedRequiredTime: TimeConfig,
    deadlineMod: TimeConfig,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

export interface EventSetting {
    at: Date,
    estimatedRequiredTime: TimeConfig,
    reminderMod: TimeConfig,
    startMod: TimeConfig,
}

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
            <select className="p-2 border border-gray-300 rounded h-full" value={props.timeConfig.unit}
                    onChange={(e) => {
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

export function TaskSettingConfig(props: { taskSetting: TaskSetting, onChange?: (taskSetting: TaskSetting) => void }) {
    return (
        <div className="flex flex-col space-y-2">

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Due Date</span>
                <input
                    type="datetime-local"
                    value={props.taskSetting.due.toISOString().slice(0, 16)}
                    className="p-2 mr-2 border border-gray-300 rounded"
                />
            </div>


            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.taskSetting.estimatedRequiredTime}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Try and finish</span>
                <TimeConfigInput timeConfig={props.taskSetting.reminderMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.taskSetting.startMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.taskSetting.startMod}/>
                <span>before</span>
            </div>
        </div>
    )
}

export function EventSettingConfig(props: { eventSetting: EventSetting, onChange?: (eventSetting: EventSetting) => void }) {
    return (
        <div className="flex flex-col space-y-2">

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>At</span>
                <input
                    type="datetime-local"
                    value={props.eventSetting.at.toISOString().slice(0, 16)}
                    className="p-2 mr-2 border border-gray-300 rounded"
                />
            </div>


            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.eventSetting.estimatedRequiredTime}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.eventSetting.startMod}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.eventSetting.startMod}/>
                <span>before</span>
            </div>
        </div>
    )
}