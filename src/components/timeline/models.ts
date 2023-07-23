import {type ScheduledEvent} from "~/utils/types";

export interface DayViewProps {
    startDay: Date,
    dayLabel: string,
    activityList: ScheduledEvent[]
}