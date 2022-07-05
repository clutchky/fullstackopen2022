
import { useState } from "react";

const App = () => {

  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const filteredPersons = persons.filter(person => person.name.includes(searchValue));

  const addName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber,
      id: persons.length + 1
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

  const handleSearchValue = (event) => {
    setSearchValue(event.target.value);
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
      <div>
          filter shown with <input value={searchValue} onChange={(handleSearchValue)}/>
      </div>
      <form onSubmit={addName}>
        <h2>add a new</h2>
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
        {filteredPersons.map(person => (
          <div key={person.id}>
            {person.name} {person.number}
          </div>
        )
        )}
      </div>
    </div>
  )
}

export default App;