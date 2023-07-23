import {type ZoneInfo} from "~/components/zone/zone-column";
import {WeekView} from "~/components/timeline/timeline-view";
import {type ScheduledEvent} from "~/utils/types";
import {useState} from "react";
import clsx from "clsx";

export function ZoneView({zone, className}: { zone?: ZoneInfo, className?: string }) {
    const [activities, setActivities] = useState<ScheduledEvent[]>([]);
    const firstDayMidnight = new Date(0, 0, 0, 0, 0, 0, 0);

    if (!zone) {
        return <></>;
    }

    return <div className={clsx("flex flex-col max-h-full py-2", className)}>
        <div className="flex flex-row items-center space-x-2">
            <div className="w-4 h-4 rounded-full" style={{backgroundColor: zone.color}}/>
            <div className="text-xl font-bold">{zone.name}</div>
        </div>
        <WeekView className="w-full h-full min-h-0 border-b-2" activityList={activities} firstDayMidnight={firstDayMidnight}/>
    </div>
}