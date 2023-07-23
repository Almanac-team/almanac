import type { Meta, StoryObj } from '@storybook/react';
import {useState} from "react";
import {TimeConfigInput, type TimeConfigUnit} from "~/components/time_picker/date";

const meta: Meta<typeof TimeConfigInput> = {
    title: 'Time Config',
    component: TimeConfigInput,
    tags: ['autodocs'],
};

export default meta;
type Story = StoryObj<typeof TimeConfigInput>;

function TimeConfigInputWrapper() {
    const [value, setValue] = useState(0);
    const [unit, setUnit] = useState<TimeConfigUnit>("hour");

    const setValueAndUnit = (value: number | undefined, unit: TimeConfigUnit | undefined) => {
        if (value !== undefined) setValue(value);
        if (unit !== undefined) setUnit(unit);
    }

    return (
        <TimeConfigInput timeConfig={{value, unit}} onChange={setValueAndUnit}/>
    )

}
export const Default: Story = {
    render: () => <TimeConfigInputWrapper />
};
