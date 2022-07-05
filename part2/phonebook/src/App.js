import { useState } from "react";

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";

const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');

  const filteredPersons = persons.filter(person => ( 
    person.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  console.log(searchValue);

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
    setNewNumber(event.target.value);
  }

  return (
    <div>
      <h2>Phonebook</h2>
      <Filter searchValue={searchValue} handleSearchValue={handleSearchValue} />
      <h3>add a new</h3>
      <PersonForm addName={addName} newName={newName} handleInputChange={handleInputChange} newNumber={newNumber} handlePhoneNumber={handlePhoneNumber} />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} />
    </div>
  )
}

export default App;