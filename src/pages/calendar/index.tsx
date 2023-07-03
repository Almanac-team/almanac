import Head from "next/head";

export default function Home() {


  return (
    <>
      <Head>
        <title>Calendar</title>
        <meta name="description" content="Calendar" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="max-h-screen">
          <div className="w-full max-h-screen overflow-y-hidden flex">

          </div>
      </main>
    </>
  );
}