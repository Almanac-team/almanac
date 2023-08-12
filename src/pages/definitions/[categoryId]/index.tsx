import { useRouter } from 'next/router';
import { ActivityColumn } from '~/components/activity/activity-column';
import { api } from '~/utils/api';
import React, { type ReactElement } from 'react';
import { Layout } from '~/components/layout';
import Head from 'next/head';

export default function Home() {
    const router = useRouter();
    const { data } = api.categories.getCategory.useQuery({
        id: String(router.query.categoryId),
    });

    if (data) {
        return (
            <>
                <Head>
                    <title>{data.categoryName} Definitions</title>
                    <meta
                        name="description"
                        content={`${data.categoryName} Definitions`}
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="h-full max-h-screen">
                    <div className="flex h-full flex-col">
                        <div className="h-full overflow-x-auto">
                            <div className="flex h-full gap-4">
                                <ActivityColumn categoryInfo={data} />
                            </div>
                        </div>
                    </div>
                </main>
            </>
        );
    } else {
        return (
            <>
                <Head>
                    <title>Loading...</title>
                    <meta
                        name="description"
                        content={`Loading Definitions...`}
                    />
                    <link rel="icon" href="/favicon.ico" />
                </Head>
                <main className="h-full max-h-screen"></main>
            </>
        );
    }
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
