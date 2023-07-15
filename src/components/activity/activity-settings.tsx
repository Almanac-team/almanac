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

function TaskSetting(props: { taskSetting: TaskSetting, onChange?: (taskSetting: TaskSetting) => void }) {
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

function EventSetting(props: { eventSetting: EventSetting, onChange?: (eventSetting: EventSetting) => void }) {
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

export function ActivitySettingModal(props: {
    activitySetting: ActivitySetting,
    onChange?: (activitySetting: ActivitySetting) => void,
    onSubmit?: () => void
}) {

    function changeTaskSetting(taskSetting: TaskSetting) {
        if (props.onChange) props.onChange({...props.activitySetting, taskSetting})
    }

    function changeEventSetting(eventSetting: EventSetting) {
        if (props.onChange) props.onChange({...props.activitySetting, eventSetting})
    }

    return (
        <div className="flex flex-col space-y-2 w-96 h-96 justify-start">
            <input
                type="text"
                value={props.activitySetting.name}
                className="p-2 mr-2 border-gray-300 border-b-2 focus:border-blue-500 focus:outline-none transition-colors text-gray-700 text-xl"
                placeholder="Activity Name"
                onChange={(e) => {
                    if (props.onChange) props.onChange({...props.activitySetting, name: e.target.value})
                }}
            />

            <Tabs activeValue={props.activitySetting.activityType} onChange={(type) => {
                if (props.onChange) props.onChange({...props.activitySetting, activityType: type as ActivityType})
            }}>
                <Tab value="task">
                    Task
                </Tab>
                <Tab value="event">
                    Event
                </Tab>
            </Tabs>

            {props.activitySetting.activityType === 'task' ?
                <TaskSetting taskSetting={props.activitySetting.taskSetting} onChange={changeTaskSetting}/> :
                <EventSetting eventSetting={props.activitySetting.eventSetting} onChange={changeEventSetting}/>}
            <Button>Save</Button>
        </div>
    );
}