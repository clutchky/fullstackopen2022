import { useState, useEffect } from "react";
import personsServices from './services/persons'

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";


const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');

  useEffect(() => {
    console.log('getting data...');

    personsServices
      .getAll()
      .then(contactList => {
        console.log('data found');
        setPersons(contactList);
      })
  }, []);

  const filteredPersons = persons.filter(person => ( 
    person.name.toLowerCase().includes(searchValue.toLowerCase())
    )
  );

  const addName = (event) => {
    event.preventDefault();

    const personObject = {
      name: newName,
      number: newNumber
    }

    const newPersons = persons.map(person => person.name);

    if (newPersons.includes(personObject.name)) {
      
      if (window.confirm(`${personObject.name} is already added to the phonebook, replace the old number with a new one?`)) {
          const matchedPerson = persons.find(person => person.name === personObject.name)
          const id = matchedPerson.id
          const changedItem = {...matchedPerson, number: newNumber}

          personsServices
            .update(id, changedItem)
            .then(updatedPerson => {
              setPersons(persons.map(person => person.id !== id ? person : updatedPerson))
              setNewName('');
              setNewNumber('');              
            })
      } else {
        setNewName('');
        setNewNumber('');
      }
    } 
    else {
      personsServices
        .create(personObject)
        .then(returnedPerson => {
          setPersons(persons.concat(returnedPerson));
          setNewName('');
          setNewNumber('');
        })
    }

  }

  const deleteName = (id) => {
    const contact = persons.find(person => person.id === id)

    if (window.confirm(`Delete ${contact.name}?`)) {
      personsServices
        .deleteItem(id)
        .then(() => {
          setPersons(persons.filter(person => person.id !== id))
        })
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
      <Persons filteredPersons={filteredPersons} deleteName={deleteName}/>
    </div>
  )
}

export default App;