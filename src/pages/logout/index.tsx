import Head from 'next/head';
import { useEffect } from 'react';
import { Spinner } from '@material-tailwind/react';

function handleSignOut() {
    const clientId = process.env.NEXT_PUBLIC_AUTH0_CLIENT_ID as string;
    const signoutRedirectUrl =
        (process.env.NEXT_PUBLIC_URL as string) + '/logout/redirect';

    window.location.href = `${
        process.env.NEXT_PUBLIC_AUTH0_ISSUER_BASE_URL as string
    }/v2/logout?client_id=${clientId}&returnTo=${encodeURIComponent(
        signoutRedirectUrl
    )}`;
}

export default function Home() {
    useEffect(() => {
        setTimeout(() => {
            handleSignOut();
        }, 1000);
    }, []);

    return (
        <>
            <Head>
                <title>Logout</title>
                <meta name="description" content="Logging out..." />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <main className="flex h-screen items-center justify-center">
                <Spinner className="h-12 w-12" />
            </main>
        </>
    );
}
