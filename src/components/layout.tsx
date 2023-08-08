import React, { useState } from 'react';
import {
    Card,
    List,
    ListItem,
    ListItemPrefix,
    Typography,
} from '@material-tailwind/react';
import {
    Bars3Icon,
    BookOpenIcon,
    CalendarIcon,
    Cog6ToothIcon,
    FlagIcon,
    PencilIcon,
    TableCellsIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

function Sidebar() {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    return (
        <Card className={`transition-all ${open ? "max-w-[20rem]" : "max-w-[6rem]"} p-4 shadow-blue-gray-900/5 transition-all duration-100 ease-in-out`}>
            <div className="mb-2 flex select-none items-center gap-4 p-4">
                <button onClick={() => setOpen(!open)}>
                    <Bars3Icon className="h-7 w-7" />
                </button>
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className={open ? '' : 'hidden'}
                >
                    Sidebar
                </Typography>
            </div>
            <List className={`select-none ${open ? "min-w-[15rem]" : "min-w-[3rem]"} transition-all duration-100 ease-in-out`}>
                <hr className={`my-2 border-blue-gray-50 ${open ? "max-w-[20rem]" : "max-w-[3rem]"}`}/>
                {open ? (
                    <ListItem onClick={() => void router.push('/track')} >
                        <ListItemPrefix>
                            <PencilIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Track
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/track')}>
                        <ListItemPrefix>
                            <PencilIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                {open ? (
                    <ListItem onClick={() => void router.push('/sprint')}>
                        <ListItemPrefix>
                            <FlagIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Sprint
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/sprint')}>
                        <ListItemPrefix>
                            <FlagIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                {open ? (
                    <ListItem onClick={() => void router.push('/calendar')}>
                        <ListItemPrefix>
                            <CalendarIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Calendar
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/calendar')}>
                        <ListItemPrefix>
                            <CalendarIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                {open ? (
                    <ListItem onClick={() => void router.push('/definitions')}>
                        <ListItemPrefix>
                            <BookOpenIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Definitions
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/definitions')}>
                        <ListItemPrefix>
                            <BookOpenIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                {open ? (
                    <ListItem onClick={() => void router.push('/zones')}>
                        <ListItemPrefix>
                            <TableCellsIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Zones
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/zones')}>
                        <ListItemPrefix>
                            <TableCellsIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                <hr className={`my-2 border-blue-gray-50 ${open ? "max-w-[20rem]" : "max-w-[3rem]"}`}/>
                {open ? (
                    <ListItem onClick={() => void router.push('/settings')}>
                        <ListItemPrefix>
                            <Cog6ToothIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Settings
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/settings')}>
                        <ListItemPrefix>
                            <Cog6ToothIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
                {open ? (
                    <ListItem onClick={() => void router.push('/account')}>
                        <ListItemPrefix>
                            <UserCircleIcon className="h-5 w-5" />
                        </ListItemPrefix>
                        Account
                    </ListItem>
                ) : (
                    <ListItem onClick={() => void router.push('/account')}>
                        <ListItemPrefix>
                            <UserCircleIcon className="h-5 w-5" />
                        </ListItemPrefix>
                    </ListItem>
                )}
            </List>
        </Card>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: sessionData } = useSession();
    
    return (
        <div className="flex max-h-screen min-h-screen w-screen flex-row overflow-hidden">
            <div className={sessionData ? "" : "hidden"}>
                <Sidebar />
            </div>
            <div className="w-full overflow-hidden">{children}</div>
        </div>
    );
}