import {LocalDateInput, LocalTimeInput} from "~/components/time_picker/date";

export type TimeConfigUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeConfig {
    value: number,
    unit: TimeConfigUnit
}

export interface ActivitySetting {
    id: string,
    name: string,
    activityType: ActivityType,
    setting: TaskSetting | EventSetting | undefined
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

export function TaskSettingConfig(props: { setting: TaskSetting, onChange?: (taskSetting: TaskSetting) => void }) {
    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>Due Date</span>
                <LocalDateInput value={props.setting.at} onChange={(newDate: Date) => props.onChange && props.onChange({
                    ...props.setting,
                    at: newDate
                })}/>

                <LocalTimeInput value={props.setting.at} onChange={(newDate: Date) => props.onChange && props.onChange({
                    ...props.setting,
                    at: newDate
                })}/>
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
                                 }}/>
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
                                 }}/>
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
                                 }}/>
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
                                 }}/>
                <span>before</span>
            </div>
        </div>
    )
}

export function EventSettingConfig(props: {
    setting: EventSetting,
    onChange?: (eventSetting: EventSetting) => void
}) {
    const localTime = new Date(props.setting.at);
    localTime.setHours(localTime.getHours() - new Date().getTimezoneOffset() / 60);

    return (
        <div className="flex flex-col space-y-2">
            <div className="flex items-center whitespace-nowrap space-x-2">
                <span>At</span>
                <LocalDateInput value={props.setting.at} onChange={(newDate: Date) => props.onChange && props.onChange({
                    ...props.setting,
                    at: newDate
                })}/>
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
                                 }}/>
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
                                 }}/>
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
                                 }}/>
                <span>before</span>
            </div>
        </div>
    )
}