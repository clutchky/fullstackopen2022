require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const Contact = require('./models/person');

app.use(express.json());
app.use(cors());
app.use(express.static('build'));

// create body token
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);   
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// Routes

// Phonebook root
app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend<h1>');
})

// Phonebook information
app.get('/info', (request, response) => {
    const info = {
        list: persons.length,
        time: new Date()
    }
    response.send(`
        <p>Phonebook has info for ${info.list} people<p>
        <p>${info.time}</p>    
    `);
})

// Display all
app.get('/api/persons', (request, response) => {
    Contact.find({})
        .then(contact => {
            response.json(contact);
        })
})

// Get individual person
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    const person = persons.find(p => p.id === id);

    if(person) {
        response.send(person);
    } else {
        response.status(404).end();
    }
    
})

// Delete entry
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id);
    persons = persons.filter(p => p.id !== id);

    response.status(204).end();
})

// Add entry
app.post('/api/persons/', (request, response) => {
    const body = request.body;

    // check if name or number is missing
    if ((body.name || body.number) === undefined) {
        return response.status(404).json({
            error: 'missing name or number'
        })
    }

    // check if name already exists
    // const filteredPersons = persons.map(person => person.name.toLowerCase())

    // if (filteredPersons.includes(body.name.toLowerCase())) {
    //     return response.status(404).json({
    //         error: 'name must be unique'
    //     })
    // }

    const person = new Contact({
        name: body.name,
        number: body.number,
    })

    person.save()
        .then(savedPerson => {
            response.json(person);
        })

})

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})