const mongoose = require('mongoose');

const url = process.env.MONGODB_URI;

console.log('connecting to', url);

mongoose
    .connect(url)
    .then(result => {
        console.log('connected to MongoDB')
    })
    .catch((error) => {
        console.log('error connecting to database', error.message);
    });

const validator = (number) => {
    return /\d\d-\d+/.test(number) || /\d{3}-\d+/.test(number)
}

const contactSchema = new mongoose.Schema({
    name: {
        type: String,
        minLength: 3,
        required: true
    },
    number: {
        type: String,
        validate: [validator, '{VALUE} is an invalid format. eg. 09-1234556 and 040-22334455 are valid phone numbers'],
        minLength: 8,
        required: true
    }
})

contactSchema.set('toJSON', {
    transform: (document, returnedObject) => {
        returnedObject.id = returnedObject._id.toString();
        delete returnedObject._id;
        delete returnedObject.__v;
    }
})

module.exports = new mongoose.model('Contact', contactSchema);