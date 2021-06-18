const Genre = require('../models/genre');


// List all authors
module.exports.list_all = async (options = {}) => {
    return Genre
        .find({},{ "_id":0 })
        .exec()
}

// Check if a genre exists
module.exports.get_id = async (name) => {
    return Genre
        .findOne({"name":name},{_id:0,name:0})
        .exec();
}