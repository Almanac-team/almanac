export function LocalDateInput({value, onChange}: { value: Date, onChange?: (date: Date) => void }) {
    return <input
        type="date"
        value={value.getFullYear().toString() + '-' + (value.getMonth() + 1).toString().padStart(2, '0') + '-' + value.getDate().toString().padStart(2, '0')}
        className="p-2 mr-2 border border-gray-300 rounded"
        onChange={(e) => {
            const newDate = new Date();
            newDate.setFullYear(parseInt(e.target.value.slice(0, 4)));
            newDate.setMonth(parseInt(e.target.value.slice(5, 7)) - 1);
            newDate.setDate(parseInt(e.target.value.slice(8, 10)));

            newDate.setHours(value.getHours());
            newDate.setMinutes(value.getMinutes());

            onChange && onChange(newDate)
        }}
    />
}