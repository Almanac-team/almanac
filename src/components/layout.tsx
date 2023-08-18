import React, { useState, createContext, useContext } from 'react';
import {
    Accordion,
    AccordionBody,
    AccordionHeader,
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
    ChevronDownIcon,
    ChevronRightIcon,
    Cog6ToothIcon,
    PencilIcon,
    TableCellsIcon,
    UserCircleIcon,
} from '@heroicons/react/24/solid';
import clsx from 'clsx';
import Link from 'next/link';
import { api } from '~/utils/api';
import { CategoryInfo } from './activity/models';

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

    return (
        <Link href={`/${route}`}>
            <ListItem>
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
        </Link>
    );
}

function Definition({ category }: { category: CategoryInfo }) {
    return (
        <Link href={`/definitions/${category.id}`}>
            <ListItem>
                <ListItemPrefix>
                    <ChevronRightIcon strokeWidth={3} className="h-3 w-5" />
                </ListItemPrefix>
                {category.categoryName}
            </ListItem>
        </Link>
    );
}

function Definitions({
    icon,
    title,
    route,
}: {
    icon: React.ReactNode;
    title: string;
    route: string;
}) {
    const [accordion, setAccordion] = React.useState(0);
    const handleAccordion = (value: number) => {
        setAccordion(accordion === value ? 0 : value);
    };
    const categoryList = api.categories.getCategories.useQuery();
    const open = useContext(StateContext);

    return (
        <Accordion
            open={accordion === 1}
            icon={
                <ChevronDownIcon
                    strokeWidth={2.5}
                    className={`mx-auto flex h-4 w-4 transition-transform ${
                        accordion === 1 ? 'rotate-180' : ''
                    }`}
                />
            }
        >
            <Link href={`/${route}`}>
                <ListItem selected={accordion === 1}>
                    <ListItemPrefix>{icon}</ListItemPrefix>
                    <span
                        className={clsx(
                            'w-auto max-w-fit overflow-hidden pr-16 transition-all ease-in-out',
                            !open && 'max-w-0'
                        )}
                    >
                        {title}
                    </span>
                    <AccordionHeader
                        onClick={(e) => {
                            handleAccordion(1);
                            e.preventDefault();
                        } }
                        className="flex w-0 items-center justify-center border-b-0 p-0" 
                    >
                        {null}
                    </AccordionHeader>
                </ListItem>
            </Link>
            <AccordionBody className="py-1">
                <List className="p-0">
                    {categoryList.isLoading ? null : (
                        <div>
                            {categoryList.data?.map((category, i) => {
                                return (
                                    <Definition key={i} category={category} />
                                );
                            })}
                        </div>
                    )}
                </List>
            </AccordionBody>
        </Accordion>
    );
}

function Sidebar() {
    const [open, setOpen] = useState(true);

    return (
        <Card
            className={clsx(
                `h-full pt-4 shadow-blue-gray-900/5 transition-all duration-100 ease-in-out`,
                open ? 'max-w-[20rem]' : 'max-w-[3.8rem]'
            )}
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
                    <Link href="/">
                        <Typography variant="h5" color="blue-gray">
                            Almanac
                        </Typography>
                    </Link>
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
                        icon={<CalendarIcon className="h-5 w-5" />}
                        title="Calendar"
                        route="calendar"
                    />
                    <Definitions
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
    return (
        <div className="flex max-h-screen min-h-screen w-screen flex-row overflow-hidden">
            <div>
                <Sidebar />
            </div>
            <div className="w-full overflow-hidden">{children}</div>
        </div>
    );
}
