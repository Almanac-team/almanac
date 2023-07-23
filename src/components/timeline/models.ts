import {createContext} from "react";

export const TimelineInteractionContext = createContext<TimelineInteraction>({});

export interface TimelineInteraction {
    selectedEventId?: string,
    onBlockClick?: (eventId: string) => void,

    onBlockDragStart?: (eventId: string) => void,
    onBlockDrag?: (eventId: string, dragPercentDelta: number) => void,
    onBlockDragEnd?: (eventId: string, dragPercentDelta: number) => void,

    onBackgroundClick?: (verticalPercent: number) => void,

    onBackgroundDragStart?: (verticalPercent: number, dragPercentDelta: number) => void,
    onBackgroundDrag?: (verticalPercent: number, dragPercentDelta: number) => void,
    onBackgroundDragEnd?: (verticalPercent: number, dragPercentDelta: number) => void,
}

export interface ScheduledBlock {
    id: string,
    name: string,
    date: Date,
    hours: number,
}

export interface DayViewProps {
    startDay: Date,
    dayLabel: string,
    activityList: ScheduledBlock[]
}