import { useState, useEffect } from 'react';

import axios from 'axios';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    console.log('getting data');

    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('data found');
        console.log(response.data);

      setCountries(response.data);
      })
  }, []);

  const searchedCountry = countries.filter(country => (
    country.name.common.toLowerCase().includes(searchValue.toLowerCase())
  ))

  const displayOne = searchValue !== '' && searchedCountry.length === 1
  const exceedLimit = searchedCountry.length > 10 && searchValue !== ''
  const withinLimit = searchedCountry.length < 10

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  }

  return (
    <div>
      <div>
        find countries <input value={searchValue} onChange={handleInputChange}/>
      </div>
      <div>
        {displayOne
        ? searchedCountry.map(country => ( // display one country
          <div key={country.name.common}>
            <h1>{country.name.common}</h1>
            <p>Capital: {country.capital}</p>
            <p>Area: {country.area}</p>
            <h3>languages</h3>
            <ul>
            {Object.values(country.languages).map((lang, i) => <li key={i}>{lang}</li>)}
            </ul>
            <img src={country.flags.svg} alt={country.name.common + '\'s flag'} width="150"/>
          </div>)
        )
        : exceedLimit
        ? 'Too many matches, specify another filter'
        : withinLimit
        ? searchedCountry.map(country => <div key={country.name.common}>{country.name.common}</div>)
        : '' // default state
        }
      </div>
    </div>
  )
}

export default App;