const Genre = require('../models/genre');

// Check if a genre exists
module.exports.get_id = async (name) => {
    return Genre
        .findOne({"name":name},{_id:0,name:0})
        .exec();
}