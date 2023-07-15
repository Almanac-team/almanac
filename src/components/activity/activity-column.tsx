import {DragDropContext, Draggable, Droppable} from '@hello-pangea/dnd';
import {ActivitySetting} from "~/components/activity/activity-settings";
import clsx from "clsx";
import {ActivityOverview} from "~/components/activity/activity-overview";

export interface CategoryInfo {
    categoryName: string;
    backgroundColor: string;
    textColor: string;
}

export function ActivityColumn({categoryInfo, activities}: {
    categoryInfo: CategoryInfo,
    activities: ActivitySetting[]
}) {
    const hexToGray = (hex: string): number => {
        const bigint = parseInt(hex.replace("#", ""), 16);
        const r = (bigint >> 16) & 255;
        const g = (bigint >> 8) & 255;
        const b = bigint & 255;

        const a = (r + g + b) / 255 / 3;
        console.log(a);
        return a;
    }

    const textColor = hexToGray(categoryInfo.backgroundColor) > 0.7 ? "text-gray-800" : "text-white";

    return (
        <div className="flex flex-col w-96 min-w-[20em] h-full">
            <div
                className="flex flex-row items-center p-2 w-full justify-center"
                style={{backgroundColor: categoryInfo.backgroundColor}}>
                <span className={clsx("font-bold", textColor)}>{categoryInfo.categoryName}</span>
            </div>
            <div className="flex flex-col w-full flex-grow overflow-y-scroll space-y-2 py-2">
                {activities.map((activity) => (
                    <ActivityOverview key={activity.id} taskName={activity.name} activitySetting={activity}
                                      categoryInfo={{...categoryInfo, textColor}}/>
                ))}
            </div>
        </div>
    )
}