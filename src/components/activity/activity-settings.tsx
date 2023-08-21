import {
    HourMinuteInput,
    LocalDateInput,
    LocalTimeInput,
    TimeConfigInput,
} from '~/components/time_picker/date';
import clsx from 'clsx';
import React, { useMemo, useState } from 'react';
import { Button } from '@material-tailwind/react';
import {
    type ActivitySetting,
    type EventSetting,
    type TaskSetting,
} from '~/components/activity/models';
import { type RepeatSetting } from '~/components/activity/activity-definition-models';

export function isTaskSetting(
    setting: TaskSetting | EventSetting | undefined
): setting is TaskSetting {
    return (setting as TaskSetting).deadlineMod !== undefined;
}

export function isEventSetting(
    setting: TaskSetting | EventSetting | undefined
): setting is EventSetting {
    return setting !== undefined && !isTaskSetting(setting);
}

export function isTask(activity: ActivitySetting): boolean {
    return activity.setting.type === 'task';
}

export function isEvent(activity: ActivitySetting): boolean {
    return activity.setting.type === 'event';
}

function intToDayOfWeek(day: number) {
    switch (day) {
        case 0:
            return 'Sunday';
        case 1:
            return 'Monday';
        case 2:
            return 'Tuesday';
        case 3:
            return 'Wednesday';
        case 4:
            return 'Thursday';
        case 5:
            return 'Friday';
        default:
            return 'Saturday';
    }
}

function intToOrdinal(num: number) {
    const lastDigit = num % 10;
    const numStr = num.toString();
    switch (lastDigit) {
        case 1:
            return numStr + 'st';
        case 2:
            return numStr + 'nd';
        case 3:
            return numStr + 'rd';
        default:
            return numStr + 'th';
    }
}

function intToMonth(month: number) {
    switch (month) {
        case 0:
            return 'January';
        case 1:
            return 'Febuary';
        case 2:
            return 'March';
        case 3:
            return 'April';
        case 4:
            return 'May';
        case 5:
            return 'June';
        case 6:
            return 'July';
        case 7:
            return 'August';
        case 8:
            return 'September';
        case 9:
            return 'October';
        case 10:
            return 'November';
        default:
            return 'December';
    }
}

export function RepeatConfigInput({
    start,
    onChange,
    repeatSetting,
}: {
    start: Date;
    onChange?: (repeatSetting: RepeatSetting) => unknown;
    repeatSetting: RepeatSetting;
}) {
    const repeatDefaultValue = useMemo(() => {
        if (repeatSetting.type === 'single') {
            return 'none';
        } else {
            const unit = repeatSetting.repeatConfig.unit;
            if (!unit) return 'none';

            switch (unit.type) {
                case 'day':
                    return 'day';
                case 'week':
                    return 'week';
                case 'month':
                    return 'month';
                case 'year':
                    return 'year';
            }
        }
    }, [repeatSetting]);

    return (
        <div className="flex items-center">
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Repeat</span>
                <select
                    value={repeatDefaultValue}
                    className="mr-2 h-full rounded border border-gray-300 p-2"
                    onChange={(e) => {
                        switch (e.target.value) {
                            case 'none':
                                onChange?.({ type: 'single' });
                                break;
                            case 'day':
                                onChange?.({
                                    type: 'repeating',
                                    repeatConfig: {
                                        every: 1,
                                        unit: { type: 'day' },
                                    },
                                    endConfig: { type: 'never' },
                                });
                                break;
                            case 'week':
                                onChange?.({
                                    type: 'repeating',
                                    repeatConfig: {
                                        every: 1,
                                        unit: {
                                            type: 'week',
                                            weekDays: 2 << start.getDay(),
                                        },
                                    },
                                    endConfig: { type: 'never' },
                                });
                                break;
                            case 'month':
                                onChange?.({
                                    type: 'repeating',
                                    repeatConfig: {
                                        every: 1,
                                        unit: {
                                            type: 'month',
                                            monthDay: start.getDate(),
                                        },
                                    },
                                    endConfig: { type: 'never' },
                                });
                                break;
                            case 'year':
                                onChange?.({
                                    type: 'repeating',
                                    repeatConfig: {
                                        every: 1,
                                        unit: {
                                            type: 'year',
                                            month: start.getMonth() + 1,
                                            day: start.getDate(),
                                        },
                                    },
                                    endConfig: { type: 'never' },
                                });
                                break;
                        }
                    }}
                >
                    <option value="none">Never</option>
                    <option value="day">Daily</option>
                    <option value="week">
                        Weekly on {intToDayOfWeek(start.getDay())}
                    </option>
                    <option value="month">
                        Monthly on the {intToOrdinal(start.getDate())}
                    </option>
                    <option value="year">
                        Annually on {intToMonth(start.getMonth())}{' '}
                        {start.getDate()}
                    </option>
                </select>
            </div>
        </div>
    );
}

export function ActivityUpdateModal({
    index,
    activitySetting,
    repeatSetting,
    onSubmit,
    updating,
}: {
    index: number;
    activitySetting: ActivitySetting;
    repeatSetting: RepeatSetting;
    onSubmit?: (
        activitySetting: ActivitySetting,
        repeatSetting: {
            index: number;
            scope: 'this' | 'all' | 'future';
            repeatSetting: RepeatSetting;
        }
    ) => unknown;
    updating?: boolean;
}) {
    const [configActivitySetting, setConfigActivitySetting] = useState<
        ActivitySetting | undefined
    >(undefined);

    const [configRepeatSetting, setConfigRepeatSetting] = useState<
        RepeatSetting | undefined
    >(undefined);

    const displayActivitySetting = useMemo(() => {
        if (!configActivitySetting) return activitySetting;
        return configActivitySetting;
    }, [configActivitySetting, activitySetting]);

    const displayConfigRepeatSetting = useMemo(() => {
        if (!configRepeatSetting) return repeatSetting;
        return configRepeatSetting;
    }, [configRepeatSetting, repeatSetting]);

    const [error, setError] = useState(false);

    let innerConfig;

    if (isTaskSetting(displayActivitySetting.setting.value)) {
        innerConfig = (
            <TaskSettingConfig
                setting={displayActivitySetting.setting.value}
                onChange={(setting: TaskSetting) => {
                    setConfigActivitySetting({
                        ...displayActivitySetting,
                        setting: { type: 'task', value: setting },
                    });
                }}
                disabled={updating}
            />
        );
    } else {
        innerConfig = (
            <EventSettingConfig
                setting={displayActivitySetting.setting.value}
                onChange={(setting: EventSetting) => {
                    setConfigActivitySetting({
                        ...displayActivitySetting,
                        setting: { type: 'event', value: setting },
                    });
                }}
                disabled={updating}
            />
        );
    }

    return (
        <div
            className={clsx(
                'flex w-96 flex-col justify-start space-y-2',
                updating && ''
            )}
        >
            <input
                type="text"
                value={displayActivitySetting.name}
                className={clsx(
                    'mr-2 border-b-2 p-2 text-xl text-gray-700 transition-colors focus:outline-none',
                    !error
                        ? 'border-gray-300 focus:border-blue-500'
                        : 'border-red-200 placeholder-red-500 focus:border-red-500'
                )}
                placeholder="Activity Name"
                onChange={(e) => {
                    setError(false);
                    setConfigActivitySetting({
                        ...displayActivitySetting,
                        name: e.target.value,
                    });
                }}
                disabled={updating}
            />
            <RepeatConfigInput
                start={displayActivitySetting.at}
                onChange={(repeatSetting: RepeatSetting) => {
                    setConfigRepeatSetting(repeatSetting);
                }}
                repeatSetting={displayConfigRepeatSetting}
            />
            {innerConfig}
            <Button
                onClick={() => {
                    if (displayActivitySetting.name.trim() === '') {
                        setError(true);
                    } else if (onSubmit) {
                        onSubmit(configActivitySetting ?? activitySetting, {
                            index,
                            scope: 'all',
                            repeatSetting: configRepeatSetting ?? repeatSetting,
                        });
                    }
                }}
                disabled={updating}
            >
                Update
            </Button>
        </div>
    );
}

export function TaskSettingConfig(props: {
    setting: TaskSetting;
    onChange?: (taskSetting: TaskSetting) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex select-none flex-col space-y-2">
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Due Date</span>
                {/*<LocalDateInput*/}
                {/*    value={props.setting.at}*/}
                {/*    onChange={(newDate: Date) =>*/}
                {/*        props.onChange &&*/}
                {/*        props.onChange({*/}
                {/*            ...props.setting,*/}
                {/*            at: newDate,*/}
                {/*        })*/}
                {/*    }*/}
                {/*    disabled={props.disabled}*/}
                {/*/>*/}

                {/*<LocalTimeInput*/}
                {/*    value={props.setting.at}*/}
                {/*    onChange={(newDate: Date) =>*/}
                {/*        props.onChange &&*/}
                {/*        props.onChange({*/}
                {/*            ...props.setting,*/}
                {/*            at: newDate,*/}
                {/*        })*/}
                {/*    }*/}
                {/*    disabled={props.disabled}*/}
                {/*/>*/}
            </div>

            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Estimated Time Required</span>
                <HourMinuteInput
                    minutes={props.setting.estimatedRequiredTime}
                    onChange={(value) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                estimatedRequiredTime: Math.max(value, 0),
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>Hours</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Try and finish</span>
                <TimeConfigInput
                    timeConfig={props.setting.deadlineMod}
                    onChange={(value, unit) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                deadlineMod: {
                                    value: Math.max(
                                        value ??
                                            props.setting.deadlineMod.value,
                                        0
                                    ),
                                    unit:
                                        unit ?? props.setting.deadlineMod.unit,
                                },
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>before</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Remind me</span>
                <TimeConfigInput
                    timeConfig={props.setting.reminderMod}
                    onChange={(value, unit) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                reminderMod: {
                                    value: Math.max(
                                        value ??
                                            props.setting.reminderMod.value,
                                        0
                                    ),
                                    unit:
                                        unit ?? props.setting.reminderMod.unit,
                                },
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>before</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Ignore until</span>
                <TimeConfigInput
                    timeConfig={props.setting.startMod}
                    onChange={(value, unit) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                startMod: {
                                    value: Math.max(
                                        value ?? props.setting.startMod.value,
                                        0
                                    ),
                                    unit: unit ?? props.setting.startMod.unit,
                                },
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>before</span>
            </div>
        </div>
    );
}

export function EventSettingConfig(props: {
    setting: EventSetting;
    onChange?: (eventSetting: EventSetting) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex select-none flex-col space-y-2">
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>At</span>
                {/*<LocalDateInput*/}
                {/*    value={props.setting.at}*/}
                {/*    onChange={(newDate: Date) =>*/}
                {/*        props.onChange &&*/}
                {/*        props.onChange({*/}
                {/*            ...props.setting,*/}
                {/*            at: newDate,*/}
                {/*        })*/}
                {/*    }*/}
                {/*    disabled={props.disabled}*/}
                {/*/>*/}

                {/*<LocalTimeInput*/}
                {/*    value={props.setting.at}*/}
                {/*    onChange={(newDate: Date) =>*/}
                {/*        props.onChange &&*/}
                {/*        props.onChange({*/}
                {/*            ...props.setting,*/}
                {/*            at: newDate,*/}
                {/*        })*/}
                {/*    }*/}
                {/*    disabled={props.disabled}*/}
                {/*/>*/}
            </div>

            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Estimated Time Required</span>
                <HourMinuteInput
                    minutes={props.setting.estimatedRequiredTime}
                    onChange={(value) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                estimatedRequiredTime: Math.max(value, 0),
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>Hours</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Remind me</span>
                <TimeConfigInput
                    timeConfig={props.setting.reminderMod}
                    onChange={(value, unit) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                reminderMod: {
                                    value: Math.max(
                                        value ??
                                            props.setting.reminderMod.value,
                                        0
                                    ),
                                    unit:
                                        unit ?? props.setting.reminderMod.unit,
                                },
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>before</span>
            </div>
            <div className="flex items-center space-x-2 whitespace-nowrap">
                <span>Ignore until</span>
                <TimeConfigInput
                    timeConfig={props.setting.startMod}
                    onChange={(value, unit) => {
                        props.onChange &&
                            props.onChange({
                                ...props.setting,
                                startMod: {
                                    value: Math.max(
                                        value ?? props.setting.startMod.value,
                                        0
                                    ),
                                    unit: unit ?? props.setting.startMod.unit,
                                },
                            });
                    }}
                    disabled={props.disabled}
                />
                <span>before</span>
            </div>
        </div>
    );
}
