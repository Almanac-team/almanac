import { useRouter } from 'next/router';
import { withAuthServerSideProps } from '~/components/generic/withAuthServerSide';

export default function Main() {
    const router = useRouter();

    return (
        <div className="flex flex-col items-center justify-between gap-10">
            <h1 className="pt-6 text-3xl font-semibold"> Almanac </h1>
            <div className="text-center">
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test test test test test test test test test test test test test
                test
            </div>
            <button
                className="rounded-m border-2 border-black px-2 py-1 font-semibold"
                onClick={() => void router.push('/')}
            >
                Dashboard
            </button>
        </div>
    );
}

export const getServerSideProps = withAuthServerSideProps();
