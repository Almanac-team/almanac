import {ZoneInfo} from "~/components/zone/zone-column";
import {api} from "~/utils/api";

export function ZoneView({zone}: { zone?: ZoneInfo }) {
    if (!zone) {
        return <></>;
    }


    return (
        <div className="flex flex-col">
            <div className="flex flex-row items-center space-x-2">
                <div className="w-4 h-4 rounded-full" style={{backgroundColor: zone.color}}/>
                <div className="text-xl font-bold">{zone.name}</div>
            </div>
            <div className="flex flex-col space-y-2">
                <div className="flex flex-row items-center space-x-2">
                    <div className="w-4 h-4 rounded-full bg-gray-400"/>
                    <div className="text-xl font-bold">Monday</div>
                </div>
            </div>
        </div>
    );
}