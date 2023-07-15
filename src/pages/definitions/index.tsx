import {signIn, signOut, useSession} from "next-auth/react";
import Head from "next/head";
import Link from "next/link";
import {api} from "~/utils/api";
import {ActivityColumn} from "~/components/activity/activity-column";
import {DragDropContext} from "@hello-pangea/dnd";
import {ActivitySetting} from "~/components/activity/activity-settings";
import {
    Button,
    Card,
    Input,
    Typography
} from "@material-tailwind/react";
import {useState} from "react";
import {useRouter} from "next/router";


const activity: ActivitySetting = {
    id: "1",
    name: "Activity",
    at: new Date(),
    estimatedRequiredTime: {value: 1, unit: "hour"},
    reminderMod: {value: 1, unit: "hour"},
    startMod: {value: 1, unit: "hour"},
    deadlineMod: {value: 1, unit: "hour"}
}

const activities: ActivitySetting[] = new Array<ActivitySetting>(5).fill(activity)

interface CategorySetting {
    id: string | undefined,
    name: string,
    color: string
}

function CategorySettings({onSubmit, buttonName}: {
    onSubmit?: (category: CategorySetting) => void,
    buttonName: string
}) {
    const [categoryName, setCategoryName] = useState("");
    const [color, setColor] = useState("#6590D5");

    const [error, setError] = useState(false);


    return <Card className="border-2 border-gray-400" color="white" shadow={true}>
        <form className="my-8 flex flex-col gap-4 px-4">
            <div>
                <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-4 font-medium"
                >
                    Category Name
                </Typography>
                <Input value={categoryName} error={error}
                       onChange={(e) => {
                           setCategoryName(e.target.value);
                           setError(false)
                       }} type="email" label="Category Name"/>


                <Typography
                    variant="small"
                    color="blue-gray"
                    className="mb-4 font-medium"
                >
                    Category Color
                </Typography>

                <input className="w-full" type="color" value={color} onChange={(e) => setColor(e.target.value)}/>
            </div>

            <Button style={{backgroundColor: color}} size="lg" onClick={() => {
                if (categoryName === "") {
                    setError(true);
                } else {
                    if (onSubmit) {
                        onSubmit({
                            id: undefined,
                            name: categoryName,
                            color: color
                        })
                    }
                }
            }}>{buttonName}</Button>
        </form>
    </Card>
}

export default function Home() {
    const [showCategorySettings, setShowCategorySettings] = useState(false);
    const {mutate: deleteMutation} = api.categories.deleteCategory.useMutation();
    const {mutate} = api.categories.createCategory.useMutation();

    const categoryList = api.categories.getCategories.useQuery();

    function addCategory(category: CategorySetting) {
        mutate(category, {
            onSuccess: () => {
                setShowCategorySettings(false);

            }
        });
    }

    function deleteAllCategories() {
        for (const category of categoryList.data ?? []) {
            deleteMutation({id: category.id});
        }
        void categoryList.refetch()
    }


    for (const activity of activities) {
        activity.id = Math.random().toString();
    }

    return (
        <>
            <Head>
                <title>Activity Definitions</title>
                <meta name="description" content="Activity Definitions"/>
                <link rel="icon" href="/favicon.ico"/>
            </Head>
            <main className="max-h-screen h-full">
                <div className="h-full flex flex-col">
                    <div className="h-24 min-h-[6rem]">
                        <Button onClick={() => setShowCategorySettings((value) => !value)}>Create Category</Button>
                        {showCategorySettings ? <div className="absolute z-30">
                            <CategorySettings buttonName="Add Category" onSubmit={addCategory}/>
                        </div> : null}
                        <Button onClick={() => deleteAllCategories()}>Delete all Categories</Button>
                    </div>
                    <div className="overflow-x-auto h-full">
                        {categoryList.isLoading ? null : <div className="flex gap-4 h-full">
                            {categoryList.data?.map((category, i) => {
                                return <ActivityColumn key={i} categoryInfo={{
                                    id: category.id,
                                    categoryName: category.name,
                                    backgroundColor: category.color,
                                    textColor: "text-white"
                                }}/>
                            })}
                        </div>}
                    </div>

                </div>
            </main>
        </>
    );
}