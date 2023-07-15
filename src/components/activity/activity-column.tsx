import clsx from "clsx";
import {ActivityOverview} from "~/components/activity/activity-overview";
import {api} from "~/utils/api";

export interface CategoryInfo {
    id: string;
    categoryName: string;
    backgroundColor: string;
    textColor: string;
}

export function ActivityColumn({categoryInfo}: {
    categoryInfo: CategoryInfo
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
    const {data: activities} = api.activities.getActivities.useQuery({categoryId: categoryInfo.id});

    return (
        <div className="flex flex-col w-96 min-w-[20em] h-full border-2 rounded-tl-md rounded-tr-md" style={{borderColor: categoryInfo.backgroundColor}}>
            <div
                className="flex flex-row items-center p-2 w-full justify-center"
                style={{backgroundColor: categoryInfo.backgroundColor}}>
                <span className={clsx("font-bold", textColor)}>{categoryInfo.categoryName}</span>
            </div>
            <div className="flex flex-col w-full flex-grow overflow-y-scroll space-y-2 py-2">
                {activities ?

                    activities.map((activity) => (
                        <ActivityOverview key={activity.id} taskName={activity.name} activityId={activity.id}
                                          categoryInfo={{...categoryInfo, textColor}}/>
                    )) : null
                }
            </div>

            <div
                className={clsx("flex flex-row p-2 w-full hover:contrast-200 cursor-pointer", textColor)}
                style={{backgroundColor: categoryInfo.backgroundColor}}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-5 h-5 mt-0.5">
                    <path d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z" />
                </svg>
                <span className="font-bold">Add Item</span>
            </div>
        </div>
    )
}