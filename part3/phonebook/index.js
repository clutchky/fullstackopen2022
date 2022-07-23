const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

let persons = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]

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
    response.json(persons);
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

// Generate random ID
const generateId = () => {
    const randomNumber = Math.floor(Math.random() * 999)
    const id = persons.length > 0
        ? randomNumber
        : 0

    return id;
}

// Add entry
app.post('/api/persons/', (request, response) => {
    const body = request.body;

    // check if name or number is missing
    if (!body.name || !body.number) {
        return response.status(404).json({
            error: 'missing name or number'
        })
    }

    // check if name already exists
    const filteredPersons = persons.map(person => person.name.toLowerCase())

    if (filteredPersons.includes(body.name.toLowerCase())) {
        return response.status(404).json({
            error: 'name must be unique'
        })
    }

    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person);

    response.json(person);
})

const PORT = process.env.PORT || 3001;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})