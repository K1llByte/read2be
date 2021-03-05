const mongoose = require('mongoose');

const genre_schema = new mongoose.Schema({
    genre_id: Number,
    name:     String
}, 
{
    versionKey: false,
    collection: 'genres'
});

module.exports = mongoose.model('genres', genre_schema);