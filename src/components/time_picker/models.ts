export type TimeConfigUnit =
    | 'minute'
    | 'hour'
    | 'day'
    | 'week'
    | 'month'
    | 'year';

export interface TimeConfig {
    value: number;
    unit: TimeConfigUnit;
}

export function convertIntToTimeConfig(time: number): TimeConfig {
    if (time >= 525600) {
        return {
            unit: 'year',
            value: time / 525600,
        };
    } else if (time >= 43200) {
        return {
            unit: 'month',
            value: time / 43200,
        };
    } else if (time >= 10080) {
        return {
            unit: 'week',
            value: time / 10080,
        };
    } else if (time >= 1440) {
        return {
            unit: 'day',
            value: time / 1440,
        };
    } else if (time >= 60) {
        return {
            unit: 'hour',
            value: time / 60,
        };
    } else {
        return {
            unit: 'minute',
            value: time,
        };
    }
}

export function convertTimeConfigToInt(timeConfig: TimeConfig): number {
    switch (timeConfig.unit) {
        case 'minute':
            return timeConfig.value;
        case 'hour':
            return timeConfig.value * 60;
        case 'day':
            return timeConfig.value * 24 * 60;
        case 'week':
            return timeConfig.value * 7 * 24 * 60;
        case 'month':
            return timeConfig.value * 30 * 24 * 60;
        case 'year':
            return timeConfig.value * 365 * 24 * 60;
    }
}
