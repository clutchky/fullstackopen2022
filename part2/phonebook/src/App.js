import { useState, useEffect } from "react";
import personsServices from './services/persons'

import Filter from "./components/Filter";
import PersonForm from "./components/PersonForm";
import Persons from "./components/Persons";
import Notification from "./components/Notification";


const App = () => {

  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [searchValue, setSearchValue] = useState('');
  const [notification, setNotification] = useState(null);

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
              setNotification({
                message:`Updated ${matchedPerson.name}'s number`, 
                status: 'green'}
              );
              setTimeout(() => {
                setNotification(null)
              }, 5000);
            })
            .catch(error => {
              setNotification({
                message:`Information of ${matchedPerson.name} has already been removed from server.`, 
                status: 'red'}
              )
              setTimeout(() => {
                setNotification(null)
              }, 5000);
              setNewName('');
              setNewNumber('');
              setPersons(persons.filter(person => person.id !== id))
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
          setNotification({message:`Added ${personObject.name}`, status: 'green'});
          setTimeout(() => {
            setNotification(null)
          }, 5000);
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
        .catch((error) => {
          setPersons(persons.filter(person => person.id !== id))
          setNewName('');
          setNewNumber('');
          setNotification({message:`${contact.name} is already removed from server`,
           status: 'red'
          })
          setTimeout(() => {
            setNotification(null)
          }, 5000)
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
      {notification &&
        <Notification message={notification.message} status={notification.status}/>
      }
      <Filter searchValue={searchValue} handleSearchValue={handleSearchValue} />
      <h3>add a new</h3>
      <PersonForm addName={addName} newName={newName} handleInputChange={handleInputChange} newNumber={newNumber} handlePhoneNumber={handlePhoneNumber} />
      <h3>Numbers</h3>
      <Persons filteredPersons={filteredPersons} deleteName={deleteName}/>
    </div>
  )
}

export default App;