const mongoose = require('mongoose');

const rate_schema = new mongoose.Schema({
    num_rates:    Number,
    current_rate: Number
}, 
{
    _id:        false,
    versionKey: false
});

const review_schema = new mongoose.Schema({
    user_id: String,
    message: String,
    date:    Date
},
{
    _id:        false,
    versionKey: false
});

const book_schema = new mongoose.Schema({
    isbn:        String,
    title:       String,
    authors:     [String],
    publisher:   String,
    genre:       Number,
    language:    Number,
    description: String,
    rate:        rate_schema,
    reviews:     [review_schema],
    cover_url:   String
}, 
{
    versionKey: false,
    collection: 'books'
});

module.exports = mongoose.model('books', book_schema);