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
    FlagIcon,
    PencilIcon,
    TableCellsIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import { useSession } from 'next-auth/react';

const StateContext = createContext(true);

function Content({
    icon,
    title,
}: {
    icon: React.ReactNode;
    title: string;
    state: boolean;
}) {
    const router = useRouter();
    const open = useContext(StateContext);

    return (
        <>
            {open ? (
                <ListItem
                    onClick={() => void router.push(`/${title.toLowerCase()}`)}
                >
                    <ListItemPrefix>{icon}</ListItemPrefix>
                    {title}
                </ListItem>
            ) : (
                <ListItem
                    onClick={() => void router.push(`/${title.toLowerCase()}`)}
                >
                    <ListItemPrefix>{icon}</ListItemPrefix>
                </ListItem>
            )}
        </>
    );
}

function Sidebar() {
    const router = useRouter();
    const [open, setOpen] = useState(true);

    return (
        <Card
            className={`h-full ${
                open ? 'max-w-[20rem]' : 'max-w-[5rem]'
            } p-4 shadow-blue-gray-900/5 transition-all duration-100 ease-in-out`}
        >
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
            <List
                className={`select-none ${
                    open ? 'min-w-[15rem]' : 'min-w-[3.8rem]'
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
                        title={'Track'}
                        state={open}
                    />
                    <Content
                        icon={<CalendarIcon className="h-5 w-5" />}
                        title={'Calendar'}
                        state={open}
                    />
                    <Content
                        icon={<BookOpenIcon className="h-5 w-5" />}
                        title={'Definitions'}
                        state={open}
                    />
                    <Content
                        icon={<TableCellsIcon className="h-5 w-5" />}
                        title={'Zones'}
                        state={open}
                    />
                    <hr
                        className={`my-2 border-blue-gray-50 ${
                            open ? 'max-w-[20rem]' : 'max-w-[3rem]'
                        }`}
                    />
                    <Content
                        icon={<Cog6ToothIcon className="h-5 w-5" />}
                        title={'Settings'}
                        state={open}
                    />
                    <Content
                        icon={<UserCircleIcon className="h-5 w-5" />}
                        title={'Account'}
                        state={open}
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
            <div className={sessionData ? "" : "hidden"}>
                <Sidebar />
            </div>
            <div className="w-full overflow-hidden">{children}</div>
        </div>
    );
}
