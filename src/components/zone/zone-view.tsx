import {useCallback, useEffect, useState} from "react";
import clsx from "clsx";
import {ZoneInfo} from "~/components/zone/models";
import {ScheduledBlock, TimelineInteractionContext} from "~/components/timeline/models";
import {WeekView} from "~/components/timeline/timeline-view";

export function ZoneView({zone, className}: { zone?: ZoneInfo, className?: string }) {
    const [scheduledBlocks, setScheduledBlocks] = useState<ScheduledBlock[]>([]);
    const firstDayMidnight = new Date(0, 0, 0, 0, 0, 0, 0);


    if (!zone) {
        return <></>;
    }

    return <div className={clsx("flex flex-col max-h-full py-2", className)}>
        <div className="flex flex-row items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: zone.color}}/>
            <div className="text-xl font-bold">{zone.name}</div>
        </div>
        <TimelineInteractionContext.Provider value={{}}>
            <WeekView className="w-full h-full min-h-0 border-b-2" blockList={scheduledBlocks}
                      firstDayMidnight={firstDayMidnight}/>
        </TimelineInteractionContext.Provider>
    </div>
}