import {useState} from "react";
import clsx from "clsx";
import {type Region, type ZoneInfo} from "~/components/zone/models";
import {TimelineInteractionContext} from "~/components/timeline/models";
import {WeekView} from "~/components/timeline/timeline-view";

interface NotCreatedRegion {
    id: undefined,
    from: number,
    to: number
}

export function ZoneView({zone, className}: { zone?: ZoneInfo, className?: string }) {
    const [scheduledBlocks, setScheduledBlocks] = useState<(Region | NotCreatedRegion)[]>((zone?.regions ?? []));

    const firstDayMidnight = new Date(0);

    const onBackgroundClick = (index: number, percentY: number) => {
        const newHourPercent = Math.max(0, Math.floor(percentY * 48 - 0.5) / 48);

        setScheduledBlocks(prev => {
            return [...prev, {
                id: undefined,
                from: (index + newHourPercent) * 24,
                to: (index + newHourPercent) * 24 + Math.min(1, (1 - newHourPercent) * 24),
            }];
        });
    }

    if (!zone) {
        return <></>;
    }


    return <div className={clsx("flex flex-col max-h-full py-2", className)}>
        <div className="flex flex-row items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: zone.color}}/>
            <div className="text-xl font-bold">{zone.name}</div>
        </div>
        <TimelineInteractionContext.Provider value={{onBackgroundClick}}>
            <WeekView className="w-full h-full min-h-0 border-b-2" blockList={scheduledBlocks.map(region => ({
                id: region.id ?? "",
                name: "",
                date: new Date(region.from * 60 * 60 * 1000),
                hours: region.to - region.from,
                color: zone.color,
            }))}
                      firstDayMidnight={firstDayMidnight}/>
        </TimelineInteractionContext.Provider>
    </div>
}