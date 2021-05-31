const Author = require('../models/author');
const Book = require('../controllers/book');

// =========================== // Author CRUD operations

// Inserts a new author
module.exports.insert = (authordata) => {
    let new_author = new Author(authordata);
    return new_author.save();
}

// List all authors
module.exports.list_all = async (options = {}) => {
    const page_limit = (options.page_limit != undefined)
        ? options.page_limit : 20;
    const page_num = (options.page_num != undefined)
        ? options.page_num : 0;

    return (await Author.aggregate([
        { "$project": {"_id":0} },
        { "$group": { 
                "_id": null,
                "num_pages": { "$sum": 1 }, 
                "authors": { "$push": "$$ROOT"  }
            }
        },
        { "$project": { 
                "_id":0,
                "num_pages": {"$ceil":{ "$divide": [ "$num_pages", page_limit ] }},
                "authors": { "$slice": [ "$authors", (page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0), page_limit ] }
            }
        }
    ]).exec())[0]
}

// Get an author by name
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
        const tmp = await Author.aggregate([
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
        return Author
            .findOne({ name: name }, { _id: 0 })
            .exec();
    }
}

// Update author data
module.exports.set = (name, authordata) => {
    return Author
        .updateOne({ name: name }, { $set: authordata })
        .exec();
}

// Delete author data
module.exports.delete = (name) => {
    return Author
        .deleteOne({ name: name })
        .exec();
}

// =========================== // Author specific methods

// Check if an author exists
module.exports.exists = async (name) => {
    let val = await Author
        .countDocuments({ name: name })
        .exec();
    return val > 0;
}