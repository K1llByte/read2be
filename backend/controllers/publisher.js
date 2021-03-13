const Publisher = require('../models/publisher');

// =========================== // User CRUD operations

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

// =========================== // Author specific methods
