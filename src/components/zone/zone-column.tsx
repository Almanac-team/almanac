import {api} from "~/utils/api";
import React, {useState} from "react";
import clsx from "clsx";
import {Menu, MenuBody, MenuHandler} from "~/components/generic/menu";
import {Button} from "@material-tailwind/react";


export interface Region {
    id: string;
    from: number;
    to: number;
}

export interface ZoneInfo {
    id: string;
    name: string;
    color: string;
    regions: Region[];
}

function AddZoneModal({onSubmit, updating}: {
    onSubmit?: (zoneInfo: ZoneInfo) => Promise<boolean>,
    updating?: boolean
}) {
    const [zoneSetting, setZoneSetting] = useState<ZoneInfo>({
        id: "-1",
        name: "",
        color: "#3cd531",
        regions: []
    });

    const [error, setError] = useState(false);

    return (
        <div className={clsx("flex flex-col space-y-2 w-96 justify-start", updating && "")}>
            <input
                type="text"
                value={zoneSetting.name}
                className={clsx("p-2 mr-2 border-b-2 focus:outline-none transition-colors text-gray-700 text-xl", !error ? "border-gray-300 focus:border-blue-500" : "border-red-200 focus:border-red-500 placeholder-red-500")}
                placeholder="Zone Name"
                onChange={(e) => {
                    setError(false);
                    setZoneSetting({...zoneSetting, name: e.target.value})
                }}
                disabled={updating}
            />
            <input className="w-full" type="color" value={zoneSetting.color}
                   onChange={(e) => setZoneSetting({...zoneSetting, color: e.target.value})}/>
            <Button onClick={
                () => {
                    if (zoneSetting.name.trim() === "") {
                        setError(true);
                    } else if (onSubmit) {
                        void onSubmit(zoneSetting).then((success) => {
                            if (!success) {
                                setError(true);
                            }
                        })
                    }
                }
            }
                    disabled={updating}
            >Create</Button>
        </div>
    );
}

export function ZoneOverview({zone}: { zone: ZoneInfo }) {
    return <p>{zone.name}</p>
}

export function ZoneColumn() {
    const queryClient = api.useContext();
    const {data: zones} = api.zones.getZones.useQuery();
    const {mutateAsync: createZone} = api.zones.createZone.useMutation();
    const [isOpen, setIsOpen] = useState(false);
    const [updating, setUpdating] = useState(false);

    return (
        <div className="flex flex-col w-96 min-w-[20em] h-full border-2 rounded-tl-md rounded-tr-md border-blue-800">
            <div
                className="flex flex-row items-center p-2 w-full justify-center select-none bg-blue-800">
                <span className="font-bold text-white">Zones</span>
            </div>
            <div className="flex flex-col w-full flex-grow overflow-y-scroll space-y-2 p-2">
                {zones ?
                    zones.map((zone) => (
                        <ZoneOverview key={zone.id} zone={zone}/>
                    )) : null
                }
            </div>

            <Menu open={isOpen} handler={setIsOpen}>
                <MenuHandler>
                    <div
                        className={clsx("flex flex-row p-2 w-full hover:contrast-200 cursor-pointer select-none text-white bg-blue-800")}>

                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                             className="w-5 h-5 mt-0.5">
                            <path
                                d="M10.75 4.75a.75.75 0 00-1.5 0v4.5h-4.5a.75.75 0 000 1.5h4.5v4.5a.75.75 0 001.5 0v-4.5h4.5a.75.75 0 000-1.5h-4.5v-4.5z"/>
                        </svg>
                        <span className="font-bold">Add Item</span>
                    </div>
                </MenuHandler>
                <MenuBody>
                    <AddZoneModal onSubmit={async (zoneInfo) => {
                        setUpdating(true);
                        try {
                            await createZone(zoneInfo);

                            void queryClient.zones.getZones.invalidate().then(() => {
                                setUpdating(false);
                                setIsOpen(false);
                            }).catch(() => {
                                setUpdating(false);
                                return false;
                            })
                            return true;
                        } catch (e) {
                            setUpdating(false);
                            return false;
                        }
                    }} updating={updating}/>
                </MenuBody>
            </Menu>
        </div>
    )
}