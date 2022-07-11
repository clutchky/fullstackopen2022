import { useState, useEffect } from 'react';

import axios from 'axios';

import CountryList from './components/CountryList';
import Country from './components/Country';

const App = () => {

  const [countries, setCountries] = useState([]);
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    console.log('getting data');

    axios
      .get('https://restcountries.com/v3.1/all')
      .then(response => {
        console.log('data found');

        setCountries(response.data);
      })
  }, []);

  const searchedCountry = countries.filter(country => (
    country.name.common.toLowerCase().includes(searchValue.toLowerCase())
  ))

  const displayOne = searchedCountry.length === 1
  const exceedLimit = searchedCountry.length > 10 

  const handleInputChange = (event) => {
    setSearchValue(event.target.value);
  }

  const handleClick = (name) => {
    setSearchValue(name)
  }

  return (
    <div>
      <div>
        find countries <input value={searchValue} onChange={handleInputChange}/>
      </div>
      <div>
        {displayOne
        ? <Country countries={searchedCountry} />
        : exceedLimit
        ? 'Too many matches, specify another filter'
        : <CountryList countries={searchedCountry} showDetails={handleClick}/>
        }
      </div>
    </div>
  )
}

export default App;