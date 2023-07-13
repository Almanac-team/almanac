import Head from "next/head";
import {Button, Card, ThemeProvider, Typography} from "@material-tailwind/react"
import SelectField from "~/components/forms/SelectField";
import { useState } from "react";
import { api } from "~/utils/api";

const tzOptions = [
  {value: "test", label: "test"},
  {value: "test2", label: "test2"}
]
const  dateFormatOptions = [
  {value: "DayMonthYear", label: "DD/MM/YYYY"},
  {value: "MonthDayYear", label: "MM/DD/YYYY"},
  {value: "YearMonthDay", label: "YYYY-MM-DD"}
]

const timeFormatOptions = [
  {value: "MidDay", label: "AM/PM"},
  {value: "Military", label: "Military"}
]
function Home() {
  const [dateFormat, setDateFormat] = useState<string>("");
  const [timeFormat, setTimeFormat] = useState<string>("");
  const updateDateFormat = (value?: string) => {
    if (value) {
      setDateFormat(() => value);
    }
  }
  const updateTimeFormat = (value?: string) => {
    if (value) {
      setTimeFormat(() => value);
    }
  }

  const mutation = api.settings.updateUserSettings.useMutation()
  const onFormSubmit = (e: React.SyntheticEvent) => {
    e.preventDefault();
    // example of request to backend
    const body = {
      timezone: "none",
      dateFormat,
      timeFormat
    }
    console.log(body)
    mutation.mutate(body);

  }

  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Settings" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-h-screen">
          <div className="w-full max-h-screen overflow-y-hidden flex flex-col">
            <Typography variant={"h2"}>Settings</Typography>
            
            <Card variant = {"filled"} shadow = {true} className="m-3 p-5 flex flex-col gap-3 w-96">
              <Typography variant = {"h3"}>Time Formatting</Typography>
              <form className="flex flex-col gap-4" onSubmit={onFormSubmit}>
                <SelectField label = {"Time Zone"} options={tzOptions} offset = {5}/>
                <SelectField label = {"Date Format"} options = {dateFormatOptions} offset = {5} initialValue={dateFormatOptions[0]} onChange={updateDateFormat}/>
                <SelectField label = {"Time Format"} options = {timeFormatOptions} offset = {5} initialValue={timeFormatOptions[0]} onChange={updateTimeFormat}/>
                <Button type="submit">Update Time Settings</Button>
              </form>
              
            </Card>
          </div>
      </main>
    </>
  );
}

export default function Page() {
  return (
    <ThemeProvider>
      <Home/>
    </ThemeProvider>
  )
}