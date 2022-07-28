require('dotenv').config();
const express = require('express');
const morgan = require('morgan');
const cors = require('cors');

const app = express();

const Contact = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());

// create body token
morgan.token('body', (req, res) => {
    return JSON.stringify(req.body);   
})

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'))


// Routes

// Phonebook root
app.get('/', (request, response) => {
    response.send('<h1>Phonebook backend 3.14<h1>');
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
app.get('/api/persons/:id', (request, response, next) => {
    Contact.findById(request.params.id)
        .then(person => {
            if (person) {
                response.json(person);
            } else {
                response.status(404).end();
            }
        })
        .catch(error => next(error));
})

// Delete entry
app.delete('/api/persons/:id', (request, response, next) => {
    Contact.findByIdAndRemove(request.params.id)
        .then(result => {
            if(result) {
                response.status(204).end();
            }
            else {
                console.log('already removed')
                response.status(404).end();
            }
        })
        .catch(error => next(error));
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

// update number
app.put('/api/persons/:id', (request, response, next) => {
    const body = request.body;

    const person = {
        name: body.name,
        number: body.number,
    }

    Contact.findByIdAndUpdate(request.params.id, person, {new: true})
        .then(updatedContact => {
            response.json(updatedContact);
        })
        .catch(error => next(error));
})

// custom error handler
const errorHandler = (error, request, response, next) => {
    console.error(error.message);

    if (error.name === 'CastError') {
        return response.status(400).send({
            error: 'malformatted id'
        })
    }

    next(error);
}

app.use(errorHandler);

const PORT = process.env.PORT;

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
})