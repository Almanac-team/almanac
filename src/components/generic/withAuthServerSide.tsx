import {getServerAuthSession} from "~/server/auth";

export function withAuthServerSideProps(){
    return async (context: never) => {
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
        const session = await getServerAuthSession(context);

        if (!session) {
            return {
                redirect: {
                    destination: "/login",
                    permanent: false,
                },
            };
        }

        return {
            props: {},
        };
    }
}
