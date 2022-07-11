
const CountryList = ({countries, showDetails}) => {

    return (
        <>
        {countries.map(country => (
            <div key={country.name.common}>
                {country.name.common} <button onClick={() => showDetails(country.name.common)}>show</button>
            </div>
        ))}
        </>
    )
}

export default CountryList