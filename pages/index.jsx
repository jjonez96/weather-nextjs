import Head from "next/head";
import { Form } from "react-bootstrap";
import { useState } from "react";
import Search from "./Search";
import Forecast from "./Forecast";
import { useJsApiLoader } from "@react-google-maps/api";
import CurrentWeather from "./currentWeather";
import useSWR from "swr";

export default function Home() {
  const [libraries] = useState(["places"]);

  const fetcher = (...args) => {
    return fetch(...args)
      .then((res) => {
        if (!res.ok) {
          throw new Error("Network response was not ok");
        }
        return res.json();
      })
      .catch((error) => {
        fetch("http://localhost:5000/reset");
        window.location
          .reload()
          .then((res) => {
            if (!res.ok) {
              throw new Error("Failed to reset the server");
            }
          })
          .catch((error) => {
            console.log(error.message);
          });
      });
  };

  useJsApiLoader({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY,
    libraries,
  });

  const { data, error } = useSWR("http://localhost:5000/current", fetcher, {
    errorRetryCount: 5,
    errorRetryInterval: 5000,
  });

  if (error) {
    return <div className="celsius">Failed to fetch data</div>;
  }
  if (!data) {
    return <p className="celsius">Loading...</p>;
  }

  const sendLocationData = async (latitude, longitude, placeName) => {
    try {
      const response = await fetch("http://localhost:5000/api/location", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          latitude,
          longitude,
          placeName,
        }),
      });
      if (!response.ok) {
        throw new Error("Network response was not ok");
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    <>
      <Head>
        <title>Weather-App</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </Head>
      <main variant="dark">
        <div className="celsius">
          <Form
            onSubmit={(event) => sendLocationData(event, latitude, longitude)}
            className="m-3"
          >
            <Search sendLocationData={sendLocationData} />
          </Form>
          <CurrentWeather data={data} />
          <h1 className="m-5">Forecast</h1>
          <Forecast fetcher={fetcher} />
        </div>
      </main>
    </>
  );
}
