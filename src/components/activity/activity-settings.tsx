import {LocalDateInput, LocalTimeInput, type TimeConfig, TimeConfigInput} from "~/components/time_picker/date";

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

export function TaskSettingConfig({activity, onChange, disabled}: {
    activity: ActivitySetting<TaskSetting>,
    onChange?: (taskSetting: TaskSetting) => void,
    disabled?: boolean
}) {
    return (
        <div className="flex flex-col space-y-2 select-none">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Due Date</span>
                <LocalDateInput value={activity.setting.at}
                                onChange={(newDate: Date) => onChange && onChange({
                                    ...activity.setting,
                                    at: newDate
                                })}
                                disabled={disabled}/>

                <LocalTimeInput value={activity.setting.at}
                                onChange={(newDate: Date) => onChange && onChange({
                                    ...activity.setting,
                                    at: newDate
                                })}
                                disabled={disabled}/>
            </div>

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={activity.setting.estimatedRequiredTime}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         estimatedRequiredTime: {
                                             value: Math.max(value ?? activity.setting.estimatedRequiredTime.value, 0),
                                             unit: unit ?? activity.setting.estimatedRequiredTime.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Try and finish</span>
                <TimeConfigInput timeConfig={activity.setting.deadlineMod}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         deadlineMod: {
                                             value: Math.max(value ?? activity.setting.deadlineMod.value, 0),
                                             unit: unit ?? activity.setting.deadlineMod.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={activity.setting.reminderMod}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         reminderMod: {
                                             value: Math.max(value ?? activity.setting.reminderMod.value, 0),
                                             unit: unit ?? activity.setting.reminderMod.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={activity.setting.startMod}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         startMod: {
                                             value: Math.max(value ?? activity.setting.startMod.value, 0),
                                             unit: unit ?? activity.setting.startMod.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
                <span>before</span>
            </div>
        </div>
    )
}

export function EventSettingConfig({activity, onChange, disabled}: {
    activity: ActivitySetting<EventSetting>,
    onChange?: (eventSetting: EventSetting) => void,
    disabled?: boolean
}) {
    const localTime = new Date(activity.setting.at);
    localTime.setHours(localTime.getHours() - new Date().getTimezoneOffset() / 60);

    return (
        <div className="flex flex-col space-y-2 select-none">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>At</span>
                <LocalDateInput value={activity.setting.at}
                                onChange={(newDate: Date) => onChange && onChange({
                                    ...activity.setting,
                                    at: newDate
                                })}
                                disabled={disabled}/>

                <LocalTimeInput value={activity.setting.at}
                                onChange={(newDate: Date) => onChange && onChange({
                                    ...activity.setting,
                                    at: newDate
                                })}
                                disabled={disabled}/>
            </div>

            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Estimated Time Required</span>
                <TimeConfigInput timeConfig={activity.setting.estimatedRequiredTime}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         estimatedRequiredTime: {
                                             value: Math.max(value ?? activity.setting.estimatedRequiredTime.value, 0),
                                             unit: unit ?? activity.setting.estimatedRequiredTime.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Remind me</span>
                <TimeConfigInput timeConfig={activity.setting.reminderMod}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         reminderMod: {
                                             value: Math.max(value ?? activity.setting.reminderMod.value, 0),
                                             unit: unit ?? activity.setting.reminderMod.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
                <span>before</span>
            </div>
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Ignore until</span>
                <TimeConfigInput timeConfig={activity.setting.startMod}
                                 onChange={(value, unit) => {
                                     onChange && onChange({
                                         ...activity.setting,
                                         startMod: {
                                             value: Math.max(value ?? activity.setting.startMod.value, 0),
                                             unit: unit ?? activity.setting.startMod.unit
                                         }
                                     })
                                 }}
                                 disabled={disabled}/>
                <span>before</span>
            </div>
        </div>
    )
}