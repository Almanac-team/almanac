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
} from '@heroicons/react/24/solid';
import { useRouter } from 'next/router';
import clsx from 'clsx';
import { useSession } from 'next-auth/react';

const StateContext = createContext(true);

function Item({ icon, title }: { icon: React.ReactNode; title: string }) {
    const router = useRouter();

    return (
        <ListItem onClick={() => void router.push(`/${title.toLowerCase()}`)}>
            <ListItemPrefix>{icon}</ListItemPrefix>
            {title}
        </ListItem>
    );
}

function Content({ icon, title }: { icon: React.ReactNode; title: string }) {
    const open = useContext(StateContext);

    return (
        <>
            {open ? (
                <Item icon={icon} title={title} />
            ) : (
                <Item icon={icon} title="" />
            )}
        </>
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
                <Typography
                    variant="h5"
                    color="blue-gray"
                    className={clsx({["hidden"]: open === false})}
                >
                    Sidebar
                </Typography>
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
                        title={'Track'}
                    />
                    <Content
                        icon={<CalendarIcon className="h-5 w-5" />}
                        title={'Calendar'}
                    />
                    <Content
                        icon={<BookOpenIcon className="h-5 w-5" />}
                        title={'Definitions'}
                    />
                    <Content
                        icon={<TableCellsIcon className="h-5 w-5" />}
                        title={'Zones'}
                    />
                    <hr
                        className={`my-2 border-blue-gray-50 ${
                            open ? 'max-w-[20rem]' : 'max-w-[3rem]'
                        }`}
                    />
                    <Content
                        icon={<Cog6ToothIcon className="h-5 w-5" />}
                        title={'Settings'}
                    />
                    <Content
                        icon={<UserCircleIcon className="h-5 w-5" />}
                        title={'Account'}
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
