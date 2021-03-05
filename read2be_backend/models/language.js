const mongoose = require('mongoose');

const language_schema = new mongoose.Schema({
    language_id: Number,
    name:        String
}, 
{
    versionKey: false,
    collection: 'languages'
});

module.exports = mongoose.model('languages', language_schema);