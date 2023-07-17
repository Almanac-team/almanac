import {LocalDateInput, LocalTimeInput, type TimeConfig, TimeConfigInput} from "~/components/time_picker/date";
import clsx from "clsx";
import React, {useState} from "react";
import {Button} from "@material-tailwind/react";

export type ActivitySettingUnion = ActivitySetting<TaskSetting | EventSetting | undefined>;

export interface ActivitySetting<T extends TaskSetting | EventSetting | undefined> {
    id: string,
    name: string,
    activityType: ActivityType,
    setting: T
}

export function isTaskSetting(setting: TaskSetting | EventSetting | undefined): setting is TaskSetting {
    return (setting as TaskSetting).deadlineMod !== undefined;
}

export function isEventSetting(setting: TaskSetting | EventSetting | undefined): setting is EventSetting {
    return setting !== undefined && !isTaskSetting(setting);
}

export interface TaskSetting {
    at: Date,
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

export function ActivitySettingModal<T extends TaskSetting | EventSetting>
({
     originalActivitySetting,
     onSubmit,
     updating
 }: {
    originalActivitySetting: ActivitySetting<T>,
    onSubmit?: (activitySetting: ActivitySetting<T>) => void,
    updating?: boolean
}) {
    const [error, setError] = useState(false);

    const [activitySetting, setActivitySetting] = useState<ActivitySetting<T>>(originalActivitySetting);
    let inner;

    if (isTaskSetting(activitySetting.setting)) {
        inner = (
            <TaskSettingConfig setting={activitySetting.setting}
                               onChange={(setting) => setActivitySetting({...activitySetting, setting: setting as T})}
                               disabled={updating}/>
        )
    } else {
        inner = (
            <EventSettingConfig setting={activitySetting.setting}
                                onChange={(setting) => setActivitySetting({
                                    ...activitySetting,
                                    setting: setting as T
                                })}
                                disabled={updating}/>
        )
    }

    return <div className={clsx("flex flex-col space-y-2 w-96 justify-start", updating && "")}>
        <input
            type="text"
            value={activitySetting.name}
            className={clsx("p-2 mr-2 border-b-2 focus:outline-none transition-colors text-gray-700 text-xl", !error ? "border-gray-300 focus:border-blue-500" : "border-red-200 focus:border-red-500 placeholder-red-500")}
            placeholder="Activity Name"
            onChange={(e) => {
                setError(false);
                setActivitySetting({...activitySetting, name: e.target.value})
            }}
            disabled={updating}
        />
        {inner}
        <Button onClick={
            () => {
                if (activitySetting.name.trim() === "") {
                    setError(true);
                } else if (onSubmit) {
                    onSubmit(activitySetting);
                }
            }
        }
                disabled={updating}
        >Update</Button>
    </div>
}

export function TaskSettingConfig(props: {
    setting: TaskSetting,
    onChange?: (taskSetting: TaskSetting) => void,
    disabled?: boolean
}) {
    return (
        <div className="flex flex-col space-y-2 select-none">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Due Date</span>
                <LocalDateInput value={props.setting.at}
                                onChange={(newDate: Date) => props.onChange && props.onChange({
                                    ...props.setting,
                                    at: newDate
                                })}
                                disabled={props.disabled}/>

                <LocalTimeInput value={props.setting.at}
                                onChange={(newDate: Date) => props.onChange && props.onChange({
                                    ...props.setting,
                                    at: newDate
                                })}
                                disabled={props.disabled}/>
            </div>

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.setting.estimatedRequiredTime}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         estimatedRequiredTime: {
                                             value: Math.max(value ?? props.setting.estimatedRequiredTime.value, 0),
                                             unit: unit ?? props.setting.estimatedRequiredTime.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Try and finish</span>
                <TimeConfigInput timeConfig={props.setting.deadlineMod}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         deadlineMod: {
                                             value: Math.max(value ?? props.setting.deadlineMod.value, 0),
                                             unit: unit ?? props.setting.deadlineMod.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.setting.reminderMod}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         reminderMod: {
                                             value: Math.max(value ?? props.setting.reminderMod.value, 0),
                                             unit: unit ?? props.setting.reminderMod.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.setting.startMod}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         startMod: {
                                             value: Math.max(value ?? props.setting.startMod.value, 0),
                                             unit: unit ?? props.setting.startMod.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
                <span>before</span>
            </div>
        </div>
    )
}

export function EventSettingConfig(props: {
    setting: EventSetting,
    onChange?: (eventSetting: EventSetting) => void,
    disabled?: boolean
}) {
    const localTime = new Date(props.setting.at);
    localTime.setHours(localTime.getHours() - new Date().getTimezoneOffset() / 60);

    return (
        <div className="flex flex-col space-y-2 select-none">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>At</span>
                <LocalDateInput value={props.setting.at}
                                onChange={(newDate: Date) => props.onChange && props.onChange({
                                    ...props.setting,
                                    at: newDate
                                })}
                                disabled={props.disabled}/>

                <LocalTimeInput value={props.setting.at}
                                onChange={(newDate: Date) => props.onChange && props.onChange({
                                    ...props.setting,
                                    at: newDate
                                })}
                                disabled={props.disabled}/>
            </div>

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={props.setting.estimatedRequiredTime}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         estimatedRequiredTime: {
                                             value: Math.max(value ?? props.setting.estimatedRequiredTime.value, 0),
                                             unit: unit ?? props.setting.estimatedRequiredTime.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={props.setting.reminderMod}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         reminderMod: {
                                             value: Math.max(value ?? props.setting.reminderMod.value, 0),
                                             unit: unit ?? props.setting.reminderMod.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={props.setting.startMod}
                                 onChange={(value, unit) => {
                                     props.onChange && props.onChange({
                                         ...props.setting,
                                         startMod: {
                                             value: Math.max(value ?? props.setting.startMod.value, 0),
                                             unit: unit ?? props.setting.startMod.unit
                                         }
                                     })
                                 }}
                                 disabled={props.disabled}/>
                <span>before</span>
            </div>
        </div>
    )
}