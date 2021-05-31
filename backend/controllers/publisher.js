const Publisher = require('../models/publisher');
const Book = require('../controllers/book');

// =========================== // User CRUD operations

// Inserts a new publisher
module.exports.insert = (publisherdata) => {
    let new_publisher = new Publisher(publisherdata);
    return new_publisher.save();
}

// List all publishers
module.exports.list_all = async (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    return (await Publisher.aggregate([
            { "$project": {"_id":0} },
            { "$group": { 
                    "_id": null,
                    "num_pages": { "$sum": 1 }, 
                    "publishers": { "$push": "$$ROOT"  }
                }
            },
            { "$project": { 
                    "_id":0,
                    "num_pages": {"$ceil":{ "$divide": [ "$num_pages", page_limit ] }},
                    "publishers": { "$slice": [ "$publishers", (page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0), page_limit ] }
                }
            }
        ]).exec())[0]
}

// Get a publisher by name
module.exports.get = async (name, options={}) => {
    if (options.inline_books == 1)
    {
        const BOOK_LOOKUP = {
            "$lookup": {
                "from": "books",
                "localField": "books",
                "foreignField": "isbn",
                "as": "books"
            }
        };
        const tmp = await Publisher.aggregate([
            BOOK_LOOKUP,
            {
                "$match": { name: name }
            },
            {
                "$project": {
                    _id: 0,
                    "books._id": 0,
                    "books.reviews": 0,
                }
            }
        ]);
        return tmp[0];
    }
    else
    {
        return Publisher
            .findOne({name:name},{_id:0})
            .exec();
    }
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