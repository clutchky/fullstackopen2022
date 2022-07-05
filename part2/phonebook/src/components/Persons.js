import PersonDetails from "../components/PersonDetails"

const Persons = ({filteredPersons}) => {
    return (
        <div>
        {filteredPersons.map(person => (
          <PersonDetails key={person.id} person={person} />
          )
        )}
      </div>
    )
}

export default Persons;