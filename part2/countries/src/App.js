import { useState, useEffect } from 'react';

import axios from 'axios';

import CountryList from './components/CountryList';
import Country from './components/Country';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [weatherData, setWeatherData] = useState([]);
  const [capital, setCapital] = useState('');

  // filter country
  const searchedCountry = countries.filter((country) => (
    country.name.common.toLowerCase().includes(searchValue.toLowerCase())
  ))

  // get country data
  useEffect(() => {
    console.log('getting countries data');

    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('data found');

        setCountries(response.data);
      })
  }, []);

  // get weather data
  useEffect(() => {

      const api_key = process.env.REACT_APP_API_KEY;

      let url = `https://api.openweathermap.org/data/2.5/weather?q=${capital}&appid=${api_key}&units=metric`

      if (capital === '') {
        url = `https://api.openweathermap.org/data/2.5/weather?q=London&appid=${api_key}&units=metric`
      
        axios
        .get(url)
        .then(response => {
          console.log('weather data found');

          setWeatherData(response.data);
        })
      } else {
      axios
        .get(url)
        .then(response => {
          console.log('weather data found');

          setWeatherData(response.data);
        })
      }
    
  }, [capital])


  const displayOne = searchedCountry.length === 1
  const exceedLimit = searchedCountry.length > 10


  const handleInputChange = (event) => {     
    setSearchValue(event.target.value);

    if (displayOne) {
      setCapital(searchedCountry[0].capital);
    }

  }

  const handleClick = (name) => {
    setSearchValue(name)

    if (displayOne) {
      setCapital(searchedCountry[0].capital);
    }
  }

  return (
    <div>
      <div>
        find countries <input value={searchValue} onChange={handleInputChange}/>
      </div>
      <div>
        {displayOne
        ? <Country countries={searchedCountry} weatherData={weatherData}/>
        : exceedLimit
        ? 'Too many matches, specify another filter'
        : <CountryList countries={searchedCountry} showDetails={handleClick}/>
        }
      </div>
    </div>
  )
}

export default App;