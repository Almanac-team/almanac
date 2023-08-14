import { type Session } from 'next-auth';
import { SessionProvider } from 'next-auth/react';
import { type AppType } from 'next/app';
import { api } from '~/utils/api';
import '~/styles/globals.css';
import { type ReactElement, type ReactNode } from 'react';
import { type NextPage } from 'next';
import { type AppPropsType } from 'next/dist/shared/lib/utils';

export type NextPageWithLayout<P = object, IP = P> = NextPage<P, IP> & {
    getLayout?: (page: ReactElement) => ReactNode;
};

const MyApp: AppType<{ session: Session | null }> = ({
    Component,
    pageProps: { session, ...pageProps },
}: /* eslint-disable  @typescript-eslint/no-explicit-any */
AppPropsType<any, { session: Session | null }> & {
    Component: NextPageWithLayout;
}) => {
    const getLayout = Component.getLayout || ((page) => page);

    return (
        <SessionProvider session={session}>
            {getLayout(<Component {...pageProps} />)}
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
