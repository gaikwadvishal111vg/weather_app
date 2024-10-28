//weather-app.js
import React, { useState } from "react";

function WeatherApp() {
  const [cityName, setCityName] = useState("");
  const [weatherDataList, setWeatherDataList] = useState([]);
  const [error, setError] = useState(null);
  const [highlightedRow, setHighlightedRow] = useState(null); 

  const handleSearch = async () => {
    if (!cityName) return;

    try {
      const response = await fetch(
        `https://python3-dot-parul-arena-2.appspot.com/test?cityname=${cityName}`
      );

      if (!response.ok) {
        throw new Error("City not found");
      }

      const data = await response.json();

      const newWeatherData = {
        id: Date.now(),
        city: cityName,
        description: data.description || "N/A",
        temperature: data.temp_in_celsius || "N/A",
        pressure: data.pressure_in_hPa || "N/A",
        dataTime: new Date(), 
      };

      const existingCityIndex = weatherDataList.findIndex(
        (weatherData) =>
          weatherData.city.toLowerCase() === cityName.toLowerCase()
      );

      if (existingCityIndex !== -1) {
        setWeatherDataList((prevList) => {
          const updatedList = [...prevList];
          updatedList[existingCityIndex] = newWeatherData;
          return updatedList;
        });

        setHighlightedRow(newWeatherData.id);
        setTimeout(() => {
          setHighlightedRow(null);
        }, 3000);
      } else {
        setWeatherDataList((prevList) => [...prevList, newWeatherData]);

        setHighlightedRow(newWeatherData.id);
        setTimeout(() => {
          setHighlightedRow(null);
        }, 3000);
      }

      setError(null);
    } catch (err) {
      setError(err.message);
    }
  };

  // Function to calculate the data age in hours
  const calculateDataAge = (dataTime) => {
    const currentTime = new Date();
    const ageInHours = Math.floor((currentTime - new Date(dataTime)) / (1000 * 60 * 60));
    console.log(`Data time: ${dataTime}, Age in hours: ${ageInHours}`); // Debugging line
    return ageInHours;
  };

  const handleDescriptionChange = (id, newDescription) => {
    setWeatherDataList((prevList) =>
      prevList.map((data) =>
        data.id === id ? { ...data, description: newDescription } : data
      )
    );
  };

  const handleDelete = (id) => {
    setWeatherDataList((prevList) => prevList.filter((data) => data.id !== id));
  };

  return (
    <div className="weather-app">
      <header className="header">
        <h1>Vishal Gaikwad Weather App</h1>
      </header>

      <div className="sidebar">
        <button className="get-weather-button" onClick={handleSearch}>
          Get Weather
        </button>
        <table className="city-list">
          <thead>
            <tr>
              <th>City</th>
            </tr>
          </thead>
          <tbody>
            <tr onClick={() => setCityName("London")}>
              <td>London</td>
            </tr>
            <tr onClick={() => setCityName("New York")}>
              <td>New York</td>
            </tr>
            <tr onClick={() => setCityName("Los Angeles")}>
              <td>Los Angeles</td>
            </tr>
            <tr onClick={() => setCityName("Las Vegas")}>
              <td>Las Vegas</td>
            </tr>
           
          </tbody>
        </table>
      </div>

      <div className="main-content">
        <div className="search-bar">
          <input
            type="text"
            placeholder="City Name"
            value={cityName}
            onChange={(e) => setCityName(e.target.value)}
          />
          <button onClick={handleSearch}>Search</button>
        </div>
        <table className="weather-table">
          <thead>
            <tr>
              <th>City</th>
              <th>Description</th>
              <th>Temperature (°C)</th>
              <th>Pressure (hPa)</th>
              <th>Data age (hrs)</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {weatherDataList.length > 0 ? (
              weatherDataList.map((data) => (
                <tr
                  key={data.id}
                  style={{
                    backgroundColor: data.id === highlightedRow ? "yellow" : "white",
                  }}
                >
                  <td>{data.city}</td>
                  <td>
                    <input
                      type="text"
                      value={data.description}
                      onChange={(e) =>
                        handleDescriptionChange(data.id, e.target.value)
                      }
                    />
                  </td>
                  <td>{data.temperature}</td>
                  <td>{data.pressure}</td>
                  <td>{calculateDataAge(data.dataTime)}</td>
                  <td>
                    <button
                      onClick={() => handleDelete(data.id)}
                      className="delete-button"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="no-data">
                  {error ? error : "No Data"}
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default WeatherApp;
