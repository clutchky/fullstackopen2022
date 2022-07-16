
const Persons = ({filteredPersons, deleteName}) => {
    return (
        <div>
        {filteredPersons.map(person => (
          <div key={person.id}>
            {person.name} {person.number} <button onClick={() => deleteName(person.id)}>delete</button>
          </div>
          )
        )}
      </div>
    )
}

export default Persons;