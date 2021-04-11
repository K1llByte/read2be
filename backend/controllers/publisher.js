const Publisher = require('../models/publisher');

// =========================== // User CRUD operations

// Inserts a new publisher
module.exports.insert = (publisherdata) => {
    let new_publisher = new Publisher(publisherdata);
    return new_publisher.save();
}

// List all publishers
module.exports.list_all = (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    return Publisher
        .find({},{_id:0})
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec();
}

// Get a publisher by name
module.exports.get = (name) => {
    return Publisher
        .findOne({name:name},{_id:0})
        .exec();
}

// Update publisher data
module.exports.set = (name,publisherdata) => {
    return Publisher
        .updateOne({name: name},{$set: publisherdata})
        .exec();
}

// Delete publisher data
module.exports.delete = (name) => {
    return Publisher
        .deleteOne({name:name})
        .exec();
}

// =========================== // Publisher specific methods

// Check if a publisher exists
module.exports.exists = async (name) => {
    let val = await Publisher
        .countDocuments({ name: name })
        .exec();
    return val > 0;
}