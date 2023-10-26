import { useState, useEffect } from "react";
import geodata from "../assets/geodata.json";

const Home = () => {
  const [weatherData, setWeatherData] = useState();
  const [lat, setLat] = useState(52.5170365);
  const [lon, setLon] = useState(13.3888599);
  const [windDirection, setWindDirection] = useState("");
  const [city, setCity] = useState("Berlin");
  const wind_deg = weatherData ? weatherData.wind.deg : "";
  //   console.log({ wind_deg });

  // - Geodaten für ausgewählte Stadt aktulisieren:
  //   console.log({ geodata });
  const getGeodata = (city) => {
    const selected_city = geodata.find((item) => item.city === city);
    selected_city
      ? (setLat(selected_city.lat),
        setLon(selected_city.lon),
        setCity(selected_city.city))
      : console.log("Stadt nicht gefunden");
    console.log({ selected_city });
    // console.log("lat, lon:", lat, lon);
  };

  //   - Umrechnen der Windrichtung in Koordinaten
  const getWindDirection = (wind_deg) => {
    if (wind_deg >= 337.5 || wind_deg < 22.5) {
      setWindDirection("Norden");
    } else if (wind_deg > 22.5 && wind_deg <= 67.5) {
      setWindDirection("Nordosten");
    } else if (wind_deg >= 67.5 && wind_deg < 112.5) {
      setWindDirection("Osten");
    } else if (wind_deg >= 112.5 && wind_deg < 157.5) {
      setWindDirection("Südosten");
    } else if (wind_deg >= 157.5 && wind_deg < 202.5) {
      setWindDirection("Süden");
    } else if (wind_deg >= 202.5 && wind_deg < 247.5) {
      setWindDirection("Südwesten");
    } else if (wind_deg >= 247.5 && wind_deg < 292.5) {
      setWindDirection("Westen");
    } else if (wind_deg >= 292.5 && wind_deg < 337.5) {
      setWindDirection("Nordwesten");
    }
    // console.log({ windDirection });
  };

  useEffect(() => {
    const fetch_link = `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&lang=de&appid=14198a73da3c334daf2c8cc21dfb50db&units=metric`;
    // console.log({ fetch_link });

    fetch(fetch_link)
      .then((response) => response.json())
      .then((data) => {
        setWeatherData(data);
        getWindDirection(wind_deg);
      })

      .catch((error) =>
        console.error("Fehler beim laden der Wetterdaten:", error)
      );

    // useEffect wird jedes mal aktualisiert, wenn lat oder lon sich ändern
    // wenn man stattdessen getGeodata() hier aufrufen würde, dann hätte man einen infinite loop ^^
  }, [lat, lon]);
  console.log({ weatherData });
  getWindDirection();

  return (
    <section>
      <article className="buttons">
        <button onClick={() => getGeodata("Berlin")}>Berlin</button>
        <button onClick={() => getGeodata("Hamburg")}>Hamburg</button>
        <button onClick={() => getGeodata("München")}>München</button>
        <button onClick={() => getGeodata("Düsseldorf")}>Düsseldorf</button>
      </article>

      {/* beim Zugriff auf weatherData immer erst checken ob Daten schon geladen sind weil sonst ein Fehler entsteht und die ganze Seite nicht geladen wird */}
      <div>
        <p className="stadt">{city ? city : ""}</p>
      </div>

      <div>
        <p>{weatherData ? weatherData.weather[0].description : ""}</p>
      </div>

      <div>
        <img
          src={`https://openweathermap.org/img/wn/${
            weatherData ? weatherData.weather[0].icon : ""
          }@2x.png`}
          alt="icon"
        />
      </div>

      <div>
        <p>Aktuell: {weatherData ? weatherData.main.temp.toFixed() : ""} °C</p>
      </div>

      <div>
        <p>
          Bewölkung: {weatherData ? weatherData.clouds.all.toFixed() : ""} %
        </p>
      </div>

      <div>
        <p>
          Wind: {weatherData ? (weatherData.wind.speed * 3.6).toFixed() : ""}{" "}
          km/h aus {weatherData ? windDirection : ""}
        </p>
      </div>

      <div>
        <p>
          Luftfeuchtigkeit:{" "}
          {weatherData ? weatherData.main.humidity.toFixed() : ""} %
        </p>
      </div>

      <div>
        <p>
          Luftdruck: {weatherData ? weatherData.main.pressure.toFixed() : ""}{" "}
          hPa
        </p>
      </div>
    </section>
  );
};

export default Home;
