import { signIn } from 'next-auth/react';

export default function Login() {
    return (
        <div className="flex flex-col h-full items-center justify-center">
            <button
                className="rounded-full border-2 border-black px-10 py-3 font-semibold"
                onClick={() => void signIn('auth0', {callbackUrl: '/'})}
            >
                Sign in
            </button>
        </div>
    );
}
