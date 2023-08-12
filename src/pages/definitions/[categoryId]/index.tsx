import { useRouter } from 'next/router';
import { ActivityColumn } from '~/components/activity/activity-column';
import { api } from '~/utils/api';
import { type ReactElement } from 'react';
import { Layout } from '~/components/layout';

export default function Home() {
    const router = useRouter();
    const { data, isLoading } = api.categories.getCategory.useQuery({
        id: String(router.query.categoryId),
    });

    if (data) {
        return (
            <>
                <main className="h-full max-h-screen">
                    <div className="flex h-full flex-col">
                        <div className="h-full overflow-x-auto">
                            {isLoading ? null : (
                                <div className="flex h-full gap-4">
                                    <ActivityColumn categoryInfo={data} />
                                </div>
                            )}
                        </div>
                    </div>
                </main>
            </>
        );
    }
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
