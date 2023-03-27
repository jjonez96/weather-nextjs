import { useEffect, useState } from "react";

const useGeoLocation = (onPlaceNameReceived) => {
  const [location, setLocation] = useState({
    loaded: false,
    coordinates: { lat: 0, lng: 0 },
    placeName: "",
  });

  const onSuccess = (location) => {
    const geocoder = new window.google.maps.Geocoder();
    const latlng = {
      lat: location.coords.latitude,
      lng: location.coords.longitude,
    };
    geocoder.geocode({ location: latlng }, (results, status) => {
      if (status === "OK") {
        if (results[0]) {
          setLocation({
            loaded: true,
            coordinates: latlng,
            placeName: results[0].formatted_address,
          });
          if (onPlaceNameReceived) {
            onPlaceNameReceived(results[0].formatted_address);
          }
        } else {
          console.log("No results found");
        }
      } else {
        console.log("Geocoder failed due to: " + status);
      }
    });
  };

  const onError = (error) => {
    setLocation({
      loaded: true,
      coordinates: {
        lat: 60.192059,
        lng: 24.945831,
      },
      error: {
        code: error.code,
        message: error.message,
      },
    });
  };

  useEffect(() => {
    const options = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0,
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(onSuccess, onError, options);
    }
  }, []);

  return location;
};

export default useGeoLocation;
