const CurrentWeather = ({ data }) => {
  const postIds = data.weather.map((weather) => weather.description);
  let timestamp = data.dt;
  const date = new Date(timestamp * 1000);
  const options = {
    timeZone: "Europe/Helsinki",
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
  };
  const updated = date.toLocaleString("en-GB", options);

  return (
    <div>
      <h1>Current weather of: {data.name}</h1>
      <img src={data.icon} alt="icon" />
      <p>Temperature: {Math.round(data.main.temp)}°C</p>
      <p>Wind: {Math.round(data.wind.speed)} M/S</p>
      <p>Pressure: {data.main.pressure} hPa</p>
      <p>Humidity: {data.main.humidity} %</p>
      <p>
        Feels like: {Math.round(data.main.feels_like)}°C, {postIds}
      </p>
      <p>Last updated: {updated}</p>
    </div>
  );
};

export default CurrentWeather;
