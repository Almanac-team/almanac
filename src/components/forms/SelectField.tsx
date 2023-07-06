import {Select, Option} from "@material-tailwind/react"
import { type onChange, propTypesMenuProps } from "@material-tailwind/react/types/components/select"
import { type offsetType } from "@material-tailwind/react/types/generic"
import { useState } from "react"

interface SelectOption {
    value: string,
    label: string
}

interface SelectFieldProps {
    options: Array<SelectOption>,
    initialValue?: SelectOption,
    label: string,
    disabled?: boolean,
    onChange?: onChange
    offset?: offsetType
}

propTypesMenuProps


export default function SelectField({options=[], label="", disabled=false, onChange=undefined, offset = undefined, initialValue = undefined}: SelectFieldProps) {
    const [selectValue, setSelectValue] = useState<string | undefined>(initialValue? initialValue.value : undefined);
    const changeHandler = (value?: string) => {
        if (value !== undefined) {
            setSelectValue(value)
        }
        
        if (typeof onChange === "function") {
            onChange(value)
        }
        
    }
    return (
        <Select label = {label} value = {selectValue} disabled = {disabled} onChange={changeHandler} offset = {offset}>
            {
                options.map(opt => <Option key = {opt.label} value = {opt.value}>{opt.label}</Option>)
            }
        </Select>
    )
}