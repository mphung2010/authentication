let mongoose = require('mongoose')

// create a model class
let contactModel = mongoose.Schema({
    name: String,
    username: String,
    password: String,
    email: String,
    contactno: Number
},
{
    collection: "contacts"
});

module.exports = mongoose.model('Contact', contactModel);
