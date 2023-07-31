import React from 'react';
import clsx from 'clsx';

const TabContext = React.createContext<TabContextValue>({
    activeValue: undefined,
    onChange: undefined,
    disabled: false,
});

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

export function Tabs({ activeValue, onChange, children, disabled }: TabsProps) {
    return (
        <div className="border-b border-gray-200 text-center text-sm font-medium text-gray-500 dark:border-gray-700 dark:text-gray-400">
            <ul className="-mb-px flex">
                <TabContext.Provider
                    value={{
                        activeValue,
                        onChange,
                        disabled: disabled ?? false,
                    }}
                >
                    {children}
                </TabContext.Provider>
            </ul>
        </div>
    );
}

interface TabProps {
    active?: boolean;
    value?: string;
    children?: string;
}

export function Tab({ value, children }: TabProps) {
    const { activeValue, onChange, disabled } =
        React.useContext<TabContextValue>(TabContext);

    return (
        <li
            className="mr-2 w-full"
            onClick={() => {
                if (onChange != undefined && value != undefined && !disabled) {
                    onChange(value);
                }
            }}
        >
            <p
                className={clsx(
                    ' inline-block w-full select-none rounded-t-lg border-b-2 p-4',
                    activeValue === value
                        ? 'active border-blue-600 text-blue-600 dark:border-blue-500 dark:text-blue-500'
                        : 'border-transparent hover:border-gray-300 hover:text-gray-600 dark:hover:text-gray-300'
                )}
            >
                {children}
            </p>
        </li>
    );
}
