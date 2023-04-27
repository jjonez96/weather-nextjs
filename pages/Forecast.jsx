import { Table } from "react-bootstrap";
import useSWR from "swr";

const Forecast = ({ fetcher }) => {
  const { data, error } = useSWR("http://localhost:5000/forecast", fetcher);

  if (error) {
    return <div className="celsius">Failed to fetch data</div>;
  }
  if (!data) {
    return <p className="celsius">Loading...</p>;
  }

  return (
    <Table bordered size="sm" className="text-light bg-dark  centerTable">
      <thead>
        <tr>
          <th>Time</th>
          <th>Temperature</th>
          <th>Wind speed</th>
          <th>Humidity</th>
          <th>Description</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, id) => {
          const weekday = new Date(item.dt).toLocaleString("en-GB", {
            weekday: "long",
          });
          const time = new Date(item.dt).toLocaleTimeString("en-GB", {
            hour: "2-digit",
            minute: "2-digit",
          });

          return (
            <tr key={id}>
              <td className="mov">
                {weekday}
                <br />
                {time}
              </td>
              <td className="move">
                {item.temp !== undefined ? Math.round(item.temp) + " °C" : ""}
              </td>
              <td className="move">{Math.round(item.wind.speed)} M/S</td>
              <td className="move">{item.humidity} %</td>
              <td>
                {item.weather && (
                  <>
                    <img
                      src={`http://openweathermap.org/img/w/${item.weather[0].icon}.png`}
                      alt="icon"
                    />
                    {item.weather[0].description}
                  </>
                )}
              </td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
};

export default Forecast;
