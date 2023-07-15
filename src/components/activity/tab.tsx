import React from "react";
import clsx from "clsx";

const TabContext = React.createContext<TabContextValue>({activeValue: undefined, onChange: undefined, disabled: false});

interface TabContextValue {
    activeValue?: string;
    onChange?: (tab: string) => void;
    disabled: boolean;
}

interface TabsProps {
    activeValue?: string;
    onChange?: (tab: string) => void;
    disabled?: boolean;
    children: React.ReactNode;
}

export function Tabs({activeValue, onChange, children, disabled}: TabsProps) {

    return (
        <div
            className="text-sm font-medium text-center text-gray-500 dark:text-gray-400 border-b border-gray-200 dark:border-gray-700">
            <ul className="flex -mb-px">
                <TabContext.Provider value={{activeValue, onChange, disabled: disabled ?? false}}>
                    {children}
                </TabContext.Provider>
            </ul>
        </div>
    )
}

interface TabProps {
    active?: boolean;
    value?: string;
    children?: string;
}

export function Tab({value, children}: TabProps) {
    const {activeValue, onChange, disabled} = React.useContext<TabContextValue>(TabContext);

    return (
        <li className="mr-2 w-full" onClick={() => {if (onChange != undefined && value != undefined && !disabled) {onChange(value)}}}>
            <p className={clsx(" w-full inline-block p-4 border-b-2 rounded-t-lg", activeValue === value ? "text-blue-600 border-blue-600 active dark:text-blue-500 dark:border-blue-500" : "border-transparent hover:text-gray-600 hover:border-gray-300 dark:hover:text-gray-300")}>{children}</p>
        </li>
    )
}