const mongoose = require('mongoose');

const user_schema = new mongoose.Schema({
    user_id:       String,
    username:      String,
    username:      String,
    password_hash: String,
    email:         String,
    role:          Number,
    avatar_url:    String
    // friends
    // pending invites
}, 
{
    versionKey: false,
    collection: 'users'
});

module.exports = mongoose.model('users', user_schema);