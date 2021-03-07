const mongoose = require('mongoose');

const rate_schema = new mongoose.Schema({
    num_rates:    Number,
    current_rate: Number
}, 
{
    versionKey: false
});

const review_schema = new mongoose.Schema({
    user_id: String,
    message: String,
    date:    Date
}, 
{
    versionKey: false
});

const book_schema = new mongoose.Schema({
    isbn:      String,
    name:      String,
    authors:   [String],
    publisher: String,
    genre:     Number,
    language:  Number,
    rate:      rate_schema,
    reviews:   [review_schema]
}, 
{
    versionKey: false,
    collection: 'books'
});

module.exports = mongoose.model('books', book_schema);