import React, { useState, createContext, useContext } from 'react';
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
    PencilIcon,
    TableCellsIcon,
    UserCircleIcon,
    FlagIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

const StateContext = createContext(true);

function Content({
    icon,
    title,
    route,
}: {
    icon: React.ReactNode;
    title: string;
    route: string;
}) {
    const open = useContext(StateContext);
    const router = useRouter();

    return (
        <ListItem onClick={() => void router.push(`/${route}`)}>
            <ListItemPrefix>{icon}</ListItemPrefix>
            <span
                className={clsx(
                    'w-auto max-w-fit overflow-hidden transition-all ease-in-out',
                    !open && 'max-w-0'
                )}
            >
                {title}
            </span>
        </ListItem>
    );
}

function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <Card
            className={`h-full ${
                open ? 'max-w-[20rem]' : 'max-w-[3.8rem]'
            } pt-4 shadow-blue-gray-900/5 transition-all duration-100 ease-in-out`}
        >
            <div className="mb-2 flex select-none items-center gap-4 p-4">
                <button onClick={() => setOpen(!open)}>
                    <Bars3Icon className="h-7 w-7" />
                </button>
                <span
                    className={clsx(
                        'w-auto max-w-fit overflow-hidden transition-all ease-in-out',
                        !open && 'max-w-0'
                    )}
                >
                    <Typography variant="h5" color="blue-gray">
                        Almanac
                    </Typography>
                </span>
            </div>
            <List
                className={`select-none ${
                    open ? 'min-w-[15rem]' : 'w-full min-w-[3rem]'
                } transition-all duration-100 ease-in-out`}
            >
                <hr
                    className={`my-2 border-blue-gray-50 ${
                        open ? 'max-w-[20rem]' : 'max-w-[3rem]'
                    }`}
                />
                <StateContext.Provider value={open}>
                    <Content
                        icon={<PencilIcon className="h-5 w-5" />}
                        title="Track"
                        route="track"
                    />
                    <Content
                        icon={<FlagIcon className="h-5 w-5" />}
                        title="Sprint"
                        route="sprint"
                    />
                    <Content
                        icon={<CalendarIcon className="h-5 w-5" />}
                        title="Calendar"
                        route="calendar"
                    />
                    <Content
                        icon={<BookOpenIcon className="h-5 w-5" />}
                        title="Definitions"
                        route="definitions"
                    />
                    <Content
                        icon={<TableCellsIcon className="h-5 w-5" />}
                        title="Zones"
                        route="zones"
                    />
                    <hr
                        className={`my-2 border-blue-gray-50 ${
                            open ? 'max-w-[20rem]' : 'max-w-[3rem]'
                        }`}
                    />
                    <Content
                        icon={<Cog6ToothIcon className="h-5 w-5" />}
                        title="Settings"
                        route="settings"
                    />
                    <Content
                        icon={<UserCircleIcon className="h-5 w-5" />}
                        title="Account"
                        route="account"
                    />
                </StateContext.Provider>
            </List>
        </Card>
    );
}

export function Layout({ children }: { children: React.ReactNode }) {
    const { data: sessionData } = useSession();

    return (
        <div className="flex max-h-screen min-h-screen w-screen flex-row overflow-hidden">
            <div className={sessionData ? '' : 'hidden'}>
                <Sidebar />
            </div>
            <div className="w-full overflow-hidden">{children}</div>
        </div>
    );
}
