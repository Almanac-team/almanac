import Head from 'next/head';
import { withAuthServerSideProps } from '~/components/generic/withAuthServerSide';
import Link from 'next/link';
import { type ReactElement } from 'react';
import { Layout } from '~/components/layout';

export default function Home() {
    return (
        <>
            <Head>
                <title>Account</title>
                <meta name="description" content="Account" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="max-h-screen">
                <div className="flex max-h-screen w-full overflow-y-hidden"></div>

                <div>
                    <Link
                        href="/logout"
                        className="rounded-sm border-2 border-black px-2 py-1 font-semibold"
                    >
                        Sign out
                    </Link>
                </div>
            </main>
        </>
    );
}
Home.getLayout = function getLayout(page: ReactElement) {
    return <Layout>{page}</Layout>;
};
export const getServerSideProps = withAuthServerSideProps();
