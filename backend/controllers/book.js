const Book = require('../models/book');

module.exports.exists = async (isbn) => {
    let val = await Book
        .countDocuments({ isbn: isbn })
        .exec()
    return val > 0;
}