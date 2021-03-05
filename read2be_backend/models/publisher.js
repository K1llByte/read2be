const mongoose = require('mongoose');

const publisher_schema = new mongoose.Schema({
    name:  String,
    books: [String]
},
{
    versionKey: false,
    collection: 'publishers'
});

module.exports = mongoose.model('publishers', publisher_schema);