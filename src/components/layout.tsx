import React from "react";
import {
    Card,
    Typography,
    List,
    ListItem,
    ListItemPrefix,
} from "@material-tailwind/react";
import {
    UserCircleIcon,
    Cog6ToothIcon,
    PencilIcon,
    CalendarIcon,
    FlagIcon,
    BookOpenIcon,
    TableCellsIcon,

} from "@heroicons/react/24/solid";
import {useRouter} from "next/router";

function Sidebar() {
    const router = useRouter();

    return (
        <Card className="h-full w-full max-w-[20rem] p-4 shadow-blue-gray-900/5">
            <div className="mb-2 flex items-center gap-4 p-4 select-none">
                <img src="/img/logo-ct-dark.png" alt="brand" className="h-8 w-8" />
                <Typography variant="h5" color="blue-gray">
                    Sidebar
                </Typography>
            </div>
            <List className="select-none">
                <hr className="my-2 border-blue-gray-50" />
                <ListItem onClick={() => void router.push('/track')}>
                    <ListItemPrefix>
                        <PencilIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Track
                </ListItem>
                <ListItem onClick={() => void router.push('/sprint')}>
                    <ListItemPrefix>
                        <FlagIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Sprint
                </ListItem>
                <ListItem onClick={() => void router.push('/calendar')}>
                    <ListItemPrefix>
                        <CalendarIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Calendar
                </ListItem>
                <ListItem onClick={() => void router.push('/definitions')}>
                    <ListItemPrefix>
                        <BookOpenIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Definitions
                </ListItem>
                <ListItem onClick={() => void router.push('/zones')}>
                    <ListItemPrefix>
                        <TableCellsIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Zones
                </ListItem>
                <hr className="my-2 border-blue-gray-50" />
                <ListItem onClick={() => void router.push('/settings')}>
                    <ListItemPrefix>
                        <Cog6ToothIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Settings
                </ListItem>
                <ListItem onClick={() => void router.push('/account')}>
                    <ListItemPrefix>
                        <UserCircleIcon className="h-5 w-5" />
                    </ListItemPrefix>
                    Account
                </ListItem>
            </List>
        </Card>
    );
}

export function Layout({children}: {children: React.ReactNode}) {
    return (
        <div className="flex flex-row max-h-screen min-h-screen w-screen overflow-hidden">
            <div>
                <Sidebar />
            </div>
            <div className="overflow-hidden">
                {children}
            </div>
        </div>
    )
}