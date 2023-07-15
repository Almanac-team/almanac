export function LocalDateInput({value, onChange, disabled}: { value: Date, onChange?: (date: Date) => void, disabled?: boolean }) {
    return <input
        type="date"
        value={value.getFullYear().toString() + '-' + (value.getMonth() + 1).toString().padStart(2, '0') + '-' + value.getDate().toString().padStart(2, '0')}
        className="p-2 mr-2 border border-gray-300 rounded"
        onChange={(e) => {
            const newDate = new Date();
            newDate.setFullYear(parseInt(e.target.value.slice(0, 4)));
            newDate.setMonth(parseInt(e.target.value.slice(5, 7)) - 1);
            newDate.setDate(parseInt(e.target.value.slice(8, 10)));

            newDate.setHours(value.getHours());
            newDate.setMinutes(value.getMinutes());

            onChange && onChange(newDate)
        }}
        disabled={disabled}
    />
}

export function LocalTimeInput({value, onChange, disabled}: { value: Date, onChange?: (date: Date) => void, disabled?: boolean }) {
    return <input
        type="time"
        value={value.getHours().toString().padStart(2, '0') + ':' + value.getMinutes().toString().padStart(2, '0')}
        className="p-2 mr-2 border border-gray-300 rounded"
        onChange={(e) => {
            const newDate = new Date(value);
            newDate.setHours(parseInt(e.target.value.slice(0, 2)));
            newDate.setMinutes(parseInt(e.target.value.slice(3, 5)));

            onChange && onChange(newDate)
        }}
        disabled={disabled}
    />
}

export type TimeConfigUnit = 'minute' | 'hour' | 'day' | 'week' | 'month' | 'year';

export interface TimeConfig {
    value: number,
    unit: TimeConfigUnit
}

export function timeConfigToMilliseconds(timeConfig: TimeConfig): number {
    switch (timeConfig.unit) {
        case "minute":
            return timeConfig.value * 60 * 1000;
        case "hour":
            return timeConfig.value * 60 * 60 * 1000;
        case "day":
            return timeConfig.value * 24 * 60 * 60 * 1000;
        case "week":
            return timeConfig.value * 7 * 24 * 60 * 60 * 1000;
        case "month":
            return timeConfig.value * 30 * 24 * 60 * 60 * 1000;
        case "year":
            return timeConfig.value * 365 * 24 * 60 * 60 * 1000;
    }
}

export function TimeConfigInput(props: {
    timeConfig: TimeConfig,
    onChange?: (value?: number, unit?: TimeConfigUnit) => void
    disabled?: boolean
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
                disabled={props.disabled}
            />
            <select className="p-2 border border-gray-300 rounded h-full" value={props.timeConfig.unit}
                    onChange={(e) => {
                        if (props.onChange) props.onChange(undefined, e.target.value as TimeConfigUnit)
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
    )
}