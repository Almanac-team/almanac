import {LocalDateInput, LocalTimeInput, type TimeConfig, TimeConfigInput} from "~/components/time_picker/date";

export interface ActivitySetting {
    id: string,
    name: string,
    activityType: ActivityType,
    setting: TaskSetting | EventSetting | undefined
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