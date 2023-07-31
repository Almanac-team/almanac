import Head from 'next/head';

export default function Home() {
	return (
		<>
			<Head>
				<title>Calendar</title>
				<meta name="description" content="Sprint" />
				<link rel="icon" href="/favicon.ico" />
			</Head>
			<main className="max-h-screen">
				<div className="flex max-h-screen w-full overflow-y-hidden"></div>
			</main>
		</>
	);
}
