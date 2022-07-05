
import { useState } from "react";

const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');

  const addName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    }

    const newPersons = persons.map(person => person.name)

    if (newPersons.includes(personObject.name)) {
      alert(`${personObject.name} is already added to the phonebook.`);
    } 
    else {
      setPersons(persons.concat(personObject));
      setNewName('');
      setNewNumber('');
    }

  }

  const handleInputChange = (event) => {
    setNewName(event.target.value);
  }

  const handlePhoneNumber = (event) => {
    setNewNumber(event.target.value)
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <form onSubmit={addName}>
        <div>
          name: <input value={newName} onChange={(handleInputChange)} />
        </div>
        <div>
          number: <input value={newNumber} onChange={handlePhoneNumber} />
        </div>
        <div>
          <button type="submit">add</button>
        </div>
      </form>
      <h2>Numbers</h2>
      <div>
        {persons.map(person => (
          <div key={person.name}>
            {person.name} {person.number}
          </div>)
        )}
      </div>
    </div>
  )
}

export default App;