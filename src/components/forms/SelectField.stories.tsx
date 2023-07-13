import SelectField from "./SelectField";
import type {StoryObj} from '@storybook/react';

export default {
    component: SelectField,
    title: 'SelectField',
    tags: ['autodocs'],
    parameters: {
        layout: 'centered'
    }
}

const testOptions = [
    {value: "Value 1", label: "Option 1"},
    {value: "Value 2", label: "Option 2"},
    {value: "Value 3", label: "Option 3"}
]

export const Default: StoryObj<typeof SelectField> = {
    args: {
        options: testOptions,
        label: "Typical use case",
        disabled: false
    }
}

export const WithDefaultValue: StoryObj<typeof SelectField> = {
    args: {
        options: testOptions,
        initialValue: testOptions[0]
    }
}