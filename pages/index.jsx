import Head from "next/head";
import useSWR from "swr";
export default function Home() {
  const fetcher = (...args) => fetch(...args).then((res) => res.json());
  const { data, error } = useSWR("http://localhost:5000/current", fetcher);
  console.log(data);
  if (error)
    return <div className="loading text-info">Hups jokin meni pieleen.</div>;
  if (!data) return <p>Loading...</p>;
  return (
    <>
      <Head>
        <title>Weather-App</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main></main>
    </>
  );
}
