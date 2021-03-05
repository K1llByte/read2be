const mongoose = require('mongoose');

const author_schema = new mongoose.Schema({
    name:  String,
    books: [String]
},
{
    versionKey: false,
    collection: 'authors'
});

module.exports = mongoose.model('authors', author_schema);