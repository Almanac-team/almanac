import { useRouter } from "next/router";
import { ActivityColumn } from "~/components/activity/activity-column";
import { api } from "~/utils/api";

export default function Category() {
    const router = useRouter();
    const { data, isError, isLoading } = api.categories.getCategory.useQuery({
        id: String(router.query.categoryId)
    });

    if (data) {
    return (
        <>
            <main className="max-h-screen h-full">
                <div className="h-full flex flex-col">
                    <div className="overflow-x-auto h-full">
                        {isLoading ? null : <div className="flex gap-4 h-full">
                            <ActivityColumn categoryInfo={data}/>
                        </div>}
                    </div>
                </div>
            </main>
        </>
    );
    }
}