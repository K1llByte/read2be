const Author = require('../models/author');

// =========================== // User CRUD operations

// List all authors
module.exports.list_all = (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    return Author
        .find({},{_id:0})
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec();
}

// Get an author by name
module.exports.get = (name) => {
    return Author
        .findOne({name:name},{_id:0})
        .exec();
}

// =========================== // Author specific methods
