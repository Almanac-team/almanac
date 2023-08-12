import Head from 'next/head';
import { signOut } from 'next-auth/react';
import { useEffect } from 'react';
import { Spinner } from '@material-tailwind/react';

export default function Home() {
    useEffect(() => {
        setTimeout(() => {
            void signOut({ callbackUrl: window.location.origin });
        }, 1000);
    }, []);

    return (
        <>
            <Head>
                <title>Redirecting</title>
                <meta name="description" content="Redirecting..." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen items-center justify-center">
                <Spinner className="h-12 w-12" />
            </main>
        </>
    );
}
