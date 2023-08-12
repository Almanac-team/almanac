import Head from 'next/head';
import { withAuthServerSideProps } from '~/components/generic/withAuthServerSide';
import { signOut } from 'next-auth/react';

export default function Home() {
    return (
        <>
            <Head>
                <title>Account</title>
                <meta name="description" content="Sprint" />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="max-h-screen">
                <div className="flex max-h-screen w-full overflow-y-hidden"></div>

                <div>
                    <button
                        className="rounded-sm border-2 border-black px-2 py-1 font-semibold"
                        onClick={() => void signOut({ callbackUrl: '/' })}
                    >
                        Sign out
                    </button>
                </div>
            </main>
        </>
    );
}

export const getServerSideProps = withAuthServerSideProps();
