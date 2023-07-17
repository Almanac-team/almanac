import {type Session} from "next-auth";
import {SessionProvider} from "next-auth/react";
import {type AppType} from "next/app";
import {api} from "~/utils/api";
import {Layout} from '~/components/layout'
import "~/styles/globals.css";
import {createContext, useEffect, useState} from "react";

export const TimeContext = createContext<Date>(new Date());

const MyApp: AppType<{ session: Session | null }> = ({
                                                         Component,
                                                         pageProps: {session, ...pageProps},
                                                     }) => {
    const [time, setTime] = useState<Date>(new Date());

    useEffect(() => {
        setInterval(() => {
            setTime(new Date());
        }, 1000);
    }, []);


    return (
        <SessionProvider session={session}>
            <Layout>
                <TimeContext.Provider value={time}>
                    <Component {...pageProps} />
                </TimeContext.Provider>
            </Layout>
        </SessionProvider>
    );
};

export default api.withTRPC(MyApp);
