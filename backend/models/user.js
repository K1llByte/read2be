const mongoose = require('mongoose');

const book_schema = new mongoose.Schema({
    isbn:            String,
    status:          Number,
    rate:            Number,
    date_registered: Date
},
{
    _id:        false,
    versionKey: false
});

const collection_schema = new mongoose.Schema({
    name:          { type: String , unique: true, required: true },
    thumbnail_url: String,
    books:         [String]
},
{
    _id:        false,
    versionKey: false
});

const user_schema = new mongoose.Schema({
    user_id:       String,
    username:      String,
    nickname:      String,
    password_hash: String,
    email:         String,
    role:          Number,
    avatar_url:    String,
    books:         [book_schema],
    friends:       [String],
    pending:       [String],
    collections:   [collection_schema]
},
{
    versionKey: false,
    collection: 'users'
});

module.exports = mongoose.model('users', user_schema);