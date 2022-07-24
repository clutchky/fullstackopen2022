const mongoose = require('mongoose');

if (process.argv.length < 3) {
    console.log('Please provide the password as an argument: node mongo.js <password>')
    process.exit(1);
}

const password = process.argv[2];

const url = `mongodb+srv://doymadmin:${password}@cluster0.q4duw.mongodb.net/phonebookApp?retryWrites=true&w=majority`;

const contactSchema = new mongoose.Schema({
    name: String,
    number: String
});

const Contact = new mongoose.model('Contact', contactSchema);

if (process.argv.length < 4) {
    // list contacts
    mongoose.connect(url)
    
    Contact.find({})
        .then((result) => {
            console.log('phonebook:')

            result.forEach(contact => {
                console.log(`${contact.name} ${contact.number}`);
            })

            mongoose.connection.close();
        }) 
} else {

mongoose.connect(url)
    .then(() => {
        console.log('connected');

        const contact = new Contact({
            name: process.argv[3],
            number: process.argv[4]
        })

        return contact.save()
    })
    .then((result) => {
        console.log(`added ${result.name} number ${result.number} to phonebook`);

        mongoose.connection.close();
    })
    .catch(err => console.log(err));
}