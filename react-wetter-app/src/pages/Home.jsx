import { useState, useEffect } from "react";
import geodata from "../assets/geodata.json";

const Home = () => {
  const [weatherData, setWeatherData] = useState();
  const [lat, setLat] = useState(52.5170365);
  const [lon, setLon] = useState(13.3888599);

  //   console.log({ geodata });

  const getGeodata = (city) => {
    const selected_city = geodata.find((item) => item.city === city);
    selected_city
      ? (setLat(selected_city.lat), setLon(selected_city.lon))
      : console.log("Stadt nicht gefunden");
    // console.log({ selected_city });
    // console.log("lat, lon:", lat, lon);
  };

  useEffect(() => {
    const fetch_link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=de&appid=14198a73da3c334daf2c8cc21dfb50db&units=metric`;
    // console.log({ fetch_link });

    fetch(fetch_link)
      .then((response) => response.json())
      .then((data) => setWeatherData(data))
      .catch((error) =>
        console.error("Fehler beim laden der Wetterdaten:", error)
      );

    // useEffect wird jedes mal aktualisiert, wenn lat oder lon sich ändern
    // wenn man stattdessen getGeodata() hier aufrufen würde, dann hätte man einen infinite loop ^^
  }, [lat, lon]);
  console.log({ weatherData });

  return (
    <section>
      <article>
        <button onClick={() => getGeodata("Berlin")}>Berlin</button>
        <button onClick={() => getGeodata("Hamburg")}>Hamburg</button>
        <button onClick={() => getGeodata("Munich")}>München</button>
        <button onClick={() => getGeodata("Dusseldorf")}>Düsseldorf</button>
      </article>

      <div className="beschreibung">
        <p>{weatherData ? weatherData.weather[0].description : ""}</p>
      </div>
      <div className="icon">
        <img
          src={`https://openweathermap.org/img/wn/${
            weatherData ? weatherData.weather[0].icon : ""
          }@2x.png`}
          alt="icon"
        />
      </div>
      <div className="temperatur">
        Aktuell: {weatherData ? weatherData.main.temp.toFixed() : ""} °C
      </div>
      <div className="windgeschwindigkeit">
        Windgeschwindigkeit:
        {weatherData ? (weatherData.wind.speed * 3.6).toFixed() : ""} km/h
      </div>
    </section>
  );
};

export default Home;
