
const Country = ({countries}) => {

    return (
        <>
          {countries.map(country => ( // display one country
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
          }
        </>
    )
}

export default Country;