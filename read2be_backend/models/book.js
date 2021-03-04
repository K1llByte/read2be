const mongoose = require('mongoose');

const book_schema = new mongoose.Schema({
    book_id:  String,
    name:     String,
    author:   String,
    genre:    Number,
    language: String
}, 
{
    versionKey: false,
    collection: 'books'
});

module.exports = mongoose.model('books', book_schema);