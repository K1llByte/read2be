const Author = require('../models/author');

// =========================== // Author CRUD operations

// Inserts a new author
module.exports.insert = (authordata) => {
    let new_author = new Author(authordata);
    return new_author.save();
}

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

// Update author data
module.exports.set = (name,authordata) => {
    return Author
        .updateOne({name: name},{$set: authordata})
        .exec();
}

// Delete author data
module.exports.delete = (name) => {
    return Author
        .deleteOne({name:name})
        .exec();
}

// =========================== // Author specific methods

// Check if an anthor exists
module.exports.exists = async (name) => {
    let val = await Author
        .countDocuments({ name: name })
        .exec();
    return val > 0;
}