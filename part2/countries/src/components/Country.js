
const Country = ({countries, weatherData}) => {

    return (
        <>
          {countries.map(country => ( // display one country
            <div key={country.name.common}>
              <h1>{country.name.common}</h1>
              <p>Capital: {country.capital[0]}</p>
              <p>Area: {country.area}</p>
              <h3>languages</h3>
              <ul>
              {Object.values(country.languages).map((lang, i) => <li key={i}>{lang}</li>)}
              </ul>
              <img src={country.flags.svg} alt={country.name.common + '\'s flag'} width="150"/>
              <h3>Weather in {country.capital}</h3>
              <p>temperature is {weatherData.main.temp} Celsius</p>
              <img src={`http://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`} alt={weatherData.weather.icon}/>
              <p>wind {weatherData.wind.speed} m/s</p>
            </div>)
            )
          }
        </>
    )
}

export default Country;