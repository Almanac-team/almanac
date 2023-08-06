import { useCallback, useState } from 'react';
import {
    type TimeConfig,
    type TimeConfigUnit,
} from '~/components/time_picker/models';

export function LocalDateInput({
    value,
    onChange,
    disabled,
}: {
    value: Date;
    onChange?: (date: Date) => void;
    disabled?: boolean;
}) {
    return (
        <input
            type="date"
            value={
                value.getFullYear().toString() +
                '-' +
                (value.getMonth() + 1).toString().padStart(2, '0') +
                '-' +
                value.getDate().toString().padStart(2, '0')
            }
            className="mr-2 rounded border border-gray-300 p-2"
            onChange={(e) => {
                const newDate = new Date();
                newDate.setFullYear(parseInt(e.target.value.slice(0, 4)));
                newDate.setMonth(parseInt(e.target.value.slice(5, 7)) - 1);
                newDate.setDate(parseInt(e.target.value.slice(8, 10)));

                newDate.setHours(value.getHours());
                newDate.setMinutes(value.getMinutes());

                onChange && onChange(newDate);
            }}
            disabled={disabled}
        />
    );
}

export function LocalTimeInput({
    value,
    onChange,
    disabled,
}: {
    value: Date;
    onChange?: (date: Date) => void;
    disabled?: boolean;
}) {
    return (
        <input
            type="time"
            value={
                value.getHours().toString().padStart(2, '0') +
                ':' +
                value.getMinutes().toString().padStart(2, '0')
            }
            className="mr-2 rounded border border-gray-300 p-2"
            onChange={(e) => {
                const newDate = new Date(value);
                newDate.setHours(parseInt(e.target.value.slice(0, 2)));
                newDate.setMinutes(parseInt(e.target.value.slice(3, 5)));

                onChange && onChange(newDate);
            }}
            disabled={disabled}
        />
    );
}

export function TimeConfigInput(props: {
    timeConfig: TimeConfig;
    onChange?: (value?: number, unit?: TimeConfigUnit) => void;
    disabled?: boolean;
}) {
    return (
        <div className="flex items-center">
            <input
                type="number"
                value={props.timeConfig.value}
                onChange={(e) => {
                    if (props.onChange)
                        props.onChange(parseInt(e.target.value), undefined);
                }}
                className="mr-2 h-full w-16 rounded border border-gray-300 p-2"
                disabled={props.disabled}
            />
            <select
                className="h-full rounded border border-gray-300 p-2"
                value={props.timeConfig.unit}
                onChange={(e) => {
                    if (props.onChange)
                        props.onChange(
                            undefined,
                            e.target.value as TimeConfigUnit
                        );
                }}
                disabled={props.disabled}
            >
                <option value="minute">Minutes</option>
                <option value="hour">Hours</option>
                <option value="day">Days</option>
                <option value="week">Weeks</option>
                <option value="month">Months</option>
                <option value="year">Years</option>
            </select>
        </div>
    );
}

function minutesToText(minutes: number) {
    return `${Math.floor(minutes / 60)}:${(minutes % 60)
        .toString()
        .padStart(2, '0')}`;
}

export function HourMinuteInput({
    minutes,
    onChange,
    disabled,
}: {
    minutes: number;
    onChange?: (value: number) => void;
    disabled?: boolean;
}) {
    const [value, setValue] = useState(minutesToText(minutes));

    const updateValue = useCallback(
        (newValue: number) => {
            setValue(minutesToText(newValue));
            if (onChange && minutes !== newValue) {
                onChange(newValue);
            }
        },
        [minutes, onChange]
    );

    return (
        <div className="flex items-center">
            <input
                type="text"
                value={value}
                onChange={(e) => {
                    setValue(e.target.value);
                }}
                onBlur={() => {
                    const colonCount =
                        value.length - value.replace(':', '').length;
                    if (colonCount > 1) {
                        // reset
                        updateValue(minutes * 60);
                        return;
                    } else if (colonCount === 1) {
                        const [hour, minute] = value.split(':');
                        if (hour === undefined || minute === undefined) return;

                        const hourNumber = parseInt(hour);
                        const minuteNumber = parseInt(minute);
                        if (isNaN(hourNumber) || isNaN(minuteNumber)) {
                            updateValue(minutes);
                        } else {
                            updateValue(hourNumber * 60 + minuteNumber);
                        }
                    } else {
                        const number = parseInt(value);
                        if (isNaN(number)) {
                            updateValue(minutes);
                        } else {
                            updateValue(number * 60);
                        }
                    }
                }}
                className="mr-2 h-full w-16 rounded border border-gray-300 p-2"
                disabled={disabled}
            />
        </div>
    );
}
