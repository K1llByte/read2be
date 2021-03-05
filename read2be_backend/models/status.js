const mongoose = require('mongoose');

const status_schema = new mongoose.Schema({
    status_id: Number,
    name:      String
}, 
{
    versionKey: false,
    collection: 'status'
});

module.exports = mongoose.model('status', status_schema);