import Head from "next/head";
import {api} from "~/utils/api";
import {ActivityColumn} from "~/components/activity/activity-column";

import {
    Button,
    Input, Menu, MenuHandler, MenuList,
    Typography
} from "@material-tailwind/react";
import React, {useState} from "react";

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


    return <form className="my-8 flex flex-col gap-4 px-4">
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
}

export default function Home() {
    const queryClient = api.useContext();
    const [showCategorySettings, setShowCategorySettings] = useState(false);

    const categoryList = api.categories.getCategories.useQuery();
    const {mutate: deleteMutation} = api.categories.deleteCategory.useMutation();
    const {mutate: createMutation} = api.categories.createCategory.useMutation();


    function addCategory(category: CategorySetting) {
        createMutation(category, {
            onSuccess: () => {
                void queryClient.categories.getCategories.invalidate().then(() => {
                    setShowCategorySettings(false);
                });
            }
        });
    }

    function deleteAllCategories() {
        for (const category of categoryList.data ?? []) {
            deleteMutation({id: category.id}, {
                onSuccess: () => {
                    void queryClient.categories.getCategories.invalidate();
                }
            });
        }
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
                        <Menu open={showCategorySettings} handler={setShowCategorySettings}>
                            <MenuHandler>
                                <Button onClick={() => setShowCategorySettings((value) => !value)}>Create
                                    Category</Button>
                            </MenuHandler>
                            <MenuList>
                                <CategorySettings buttonName="Add Category" onSubmit={addCategory}/>
                            </MenuList>
                        </Menu>
                        <Button onClick={() => deleteAllCategories()}>Delete all Categories</Button>
                    </div>
                    <div className="overflow-x-auto h-full">
                        {categoryList.isLoading ? null : <div className="flex gap-4 h-full">
                            {categoryList.data?.map((category, i) => {
                                return <ActivityColumn key={i} categoryInfo={category}/>
                            })}
                        </div>}
                    </div>
                </div>
            </main>
        </>
    );
}