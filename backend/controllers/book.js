const Book = require('../models/book');

const BOOK_PROJECTION = {
    "_id"       : 0,
    "isbn"      : 1,
    "title"     : 1,
    "authors"   : 1,
    "publisher" : 1,
    "genre"    : { $arrayElemAt: [ "$genre.name" , 0 ] },
    "language" : { $arrayElemAt: [ "$language.name" , 0 ] },
    "rate"      : "$rate.current_rate",
    "reviews"   : 1,
    "cover_url" : 1
};

const GENRE_LOOKUP = {
    "$lookup": {
      "from"         : "genres",
      "localField"   : "genre",
      "foreignField" : "genre_id",
      "as"           : "genre"
    }
};

const LANGUAGE_LOOKUP = {
    "$lookup": {
      "from"         : "languages",
      "localField"   : "language",
      "foreignField" : "language_id",
      "as"           : "language"
    }
};

// =========================== // Book CRUD operations

// Inserts a new book
module.exports.insert = (bookdata) => {
    const book = {
        "isbn": bookdata.isbn,
        "title": bookdata.title,
        "authors": bookdata.authors,
        "publisher": bookdata.publisher,
        "genre": bookdata.genre,
        "language": bookdata.language,
        "rate": { "num_rates": 0, "current_rate": 0 },
        "reviews": [],
        "cover_url": ""
    };
    let new_book = new Book(book);
    return new_book.save();
}

// List all users
module.exports.list_all = (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    return Book.aggregate([
            GENRE_LOOKUP,
            LANGUAGE_LOOKUP,
            { "$project": BOOK_PROJECTION }
        ])
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec();
}

// Get a book by isbn
module.exports.get = async (isbn) => {
    let b = await Book
    .aggregate([
        GENRE_LOOKUP,
        LANGUAGE_LOOKUP,
        {
            "$match": { isbn: isbn }
        },
        { "$project": BOOK_PROJECTION }
    ]).exec();
    return b[0];
}

// Update book data
module.exports.set = (name,bookdata) => {
    return Publisher
        .updateOne({name: name},{$set: bookdata})
        .exec();
}

// Delete book data
module.exports.delete = (isbn) => {
    return Book
        .deleteOne({isbn:isbn})
        .exec();
}

// =========================== // Book specific methods

// Check if a book exists
module.exports.exists = async (isbn) => {
    let val = await Book
        .countDocuments({ isbn: isbn })
        .exec()
    return val > 0;
}