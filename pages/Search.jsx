import { useRef, useEffect, useState } from "react";
import { Button, InputGroup, Form } from "react-bootstrap";
import useGeoLocation from "../hooks/useGeoLocation";

const Search = ({ sendLocationData }) => {
  const location = useGeoLocation();
  const center = location.coordinates;
  const originRef = useRef();
  const autocompleteRef = useRef();

  const handleOriginClick = () => {
    const geocodeJson = "https://maps.googleapis.com/maps/api/geocode/json";
    const url = `${geocodeJson}?key=${process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY}&latlng=${center.lat},${center.lng}`;
    fetch(url)
      .then((response) => {
        if (!response.ok) {
          throw new Error("Network response was not ok");
        }
        return response.json();
      })
      .then((location) => {
        const place = location.results[0];
        originRef.current.value = `${place.formatted_address}`;
        sendLocationData(center.lat, center.lng);
      })
      .catch((error) => {
        console.log(error.message);
      });
  };

  useEffect(() => {
    if (typeof window !== "undefined") {
      const autocomplete = window.google.maps;
      const settings = {
        fields: ["place_id", "geometry", "formatted_address", "name"],
        strictBounds: false,
      };
      autocompleteRef.current = new autocomplete.places.Autocomplete(
        originRef.current,
        settings
      );
      autocompleteRef.current.addListener("place_changed", () => {
        const place = autocompleteRef.current.getPlace();
        if (place && place.geometry && place.geometry.location) {
          const location = place.geometry.location;
          sendLocationData(location.lat(), location.lng());
        } else {
          console.log("Cannot determine location from input.");
        }
      });
    }
  }, []);

  return (
    <>
      <InputGroup>
        <Form.Control
          className="bg-dark text-light mx-auto"
          type="text"
          ref={originRef}
          onChange={(event) => sendLocationData(event.target.value)}
          required
        />
        <Button
          onClick={handleOriginClick}
          className="text-light float-right icon"
        >
          Your location
        </Button>
      </InputGroup>
      <Button type="submit" variant="success" className="w-75 m-2">
        SEND
      </Button>
    </>
  );
};

export default Search;
