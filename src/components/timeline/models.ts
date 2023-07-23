export interface ScheduledEvent {
    id: string,
    name: string,
    date: Date,
    hours: number,
}

export interface DayViewProps {
    startDay: Date,
    dayLabel: string,
    activityList: ScheduledEvent[]
}