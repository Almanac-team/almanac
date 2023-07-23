import {createContext} from "react";

export const TimelineInteractionContext = createContext<TimelineInteraction>({});

export interface TimelineInteraction {
    selectedEventId?: string,
    onBlockClick?: (blockId: string) => void,

    onBlockDragStart?: (blockId: string) => void,
    onBlockDrag?: (blockId: string, dragPercentDelta: number) => void,
    onBlockDragEnd?: (blockId: string, dragPercentDelta: number) => void,

    onBackgroundClick?: (index: number, verticalPercent: number) => void,

    onBackgroundDragStart?: (index: number, verticalPercent: number, dragPercentDelta: number) => void,
    onBackgroundDrag?: (index: number, verticalPercent: number, dragPercentDelta: number) => void,
    onBackgroundDragEnd?: (index: number, verticalPercent: number, dragPercentDelta: number) => void,
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
    blockList: ScheduledBlock[]
}