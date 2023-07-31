import { createContext } from 'react';

export const TimelineInteractionContext = createContext<TimelineInteraction>(
    {}
);

export interface TimelineInteraction {
    selectedEventId?: string;
    onBlockClick?: (blockId: string) => void;

    onBlockMouseDown?: (blockId: string) => void;
    // onBlockDrag?: (blockId: string, dragPercentDelta: number) => void,
    // onBlockDragEnd?: (blockId: string, dragPercentDelta: number) => void,

    onBackgroundClick?: (index: number, percentY: number) => void;

    onBackgroundMouseDown?: (
        index: number,
        pos: { x: number; y: number },
        elementHeight: number
    ) => void;
    // onBackgroundDrag?: (index: number, verticalPercent: number, dragPercentDelta: number) => void,
    // onBackgroundDragEnd?: (index: number, verticalPercent: number, dragPercentDelta: number) => void,
}

export interface ScheduledBlock {
    id: string;
    name: string;
    date: Date;
    hours: number;
    color?: string;
}

export interface DayViewProps {
    startDay: Date;
    dayLabel: string;
    blockList: ScheduledBlock[];
}
