const Book = require('../models/book');

const BOOK_PROJECTION = {
    "_id"            : 0,
    "isbn"           : 1,
    "title"          : 1,
    "authors"        : 1,
    "publisher"      : 1,
    "genres"         : "$genres.name",
    "language"       : { $arrayElemAt: [ "$language.name" , 0 ] },
    "description"    : 1,
    "published_year" : 1,
    "rate"           : "$rate.current_rate",
    "reviews"        : 1,
    "cover_url"      : 1
};

const GENRES_LOOKUP = {
    "$lookup": {
      "from"         : "genres",
      "localField"   : "genres",
      "foreignField" : "genre_id",
      "as"           : "genres"
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
module.exports.insert = async (bookdata) => {
    if(await this.exists(bookdata.isbn))
        return null;

    const book = {
        "isbn":           bookdata.isbn,
        "title":          bookdata.title,
        "authors":        bookdata.authors,
        "publisher":      bookdata.publisher,
        "genres":         bookdata.genres,
        "language":       bookdata.language,
        "description":    bookdata.description,
        "published_year": bookdata.published_year || null,
        "rate":           { "num_rates": 0, "current_rate": 0 },
        "reviews":        [],
        "cover_url":      bookdata.cover_url
    };
    let new_book = new Book(book);
    return new_book.save();
}

// List & Search books
module.exports.list_all = async (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    const pipeline = [];
    const match = { "$match": {} }

    if(options.search_query != undefined)
    {
        // Split the search query string and
        // turn it into a regex to match in the 
        // database.
        let search_rgx = RegExp(`((${options.search_query.replace(" ",")|(")}))+`,"gi")
        
        match["$match"]["title"] = { "$regex": RegExp(search_rgx,"gi") };
    }

    if(options.genre != undefined)
    {   
        match["$match"]["genres"] = options.genre;
    }

    pipeline.push(match);
    
    pipeline.concat([
        GENRES_LOOKUP,
        LANGUAGE_LOOKUP,
        { "$project": BOOK_PROJECTION }
    ]);
    
    if (options.sort_by != undefined)
    {
        let sorting = {
            "$sort": {}
        };
        sorting["$sort"][options.sort_by] = options.order;

        pipeline.push(sorting);
    }

    pipeline.push({ "$group": { 
        "_id": null,
        "num_pages": { "$sum": 1 }, 
        "books": { "$push": "$$ROOT"  }
    }});

    pipeline.push({ "$project": { 
        "_id":0,
        "num_pages": {"$ceil":{ "$divide": [ "$num_pages", page_limit ] }},
        "books": { "$slice": [ "$books", (page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0), page_limit ] }
    } });

    let res = await Book.aggregate(pipeline).exec();
    return res[0];
}

// Get a book by isbn
module.exports.get = async (isbn) => {
    let b = await Book
    .aggregate([
        GENRES_LOOKUP,
        LANGUAGE_LOOKUP,
        {
            "$match": { isbn: isbn }
        },
        { "$project": BOOK_PROJECTION }
    ]).exec();
    return b[0];
}

// Update book data
module.exports.set = (isbn, bookdata) => {
    const book = {
        isbn: bookdata.isbn,
        title: bookdata.title,
        authors: bookdata.authors,
        publisher: bookdata.publisher,
        genres: bookdata.genres,
        language: bookdata.language,
        description: bookdata.description,
        published_year: bookdata.published_year,
        cover_url: bookdata.cover_url
    };

    Object.keys(book)
        .forEach(key => book[key] === undefined ? delete book[key] : {});

    return Book
        .updateOne({isbn: isbn},{$set: book})
        .exec();
}

// Delete book data
module.exports.delete = (isbn) => {
    return Book
        .deleteOne({isbn:isbn})
        .exec();
}

// =========================== // Book specific methods

// Add book rate
module.exports.add_rate = async (isbn, rate) => {
    
    const bookdata = await Book.findOne({isbn: isbn},{ "rate":1 }).exec()
    const nr = bookdata.rate.num_rates;
    const new_nr = nr + 1;
    const new_cr = (bookdata.rate.current_rate * nr + rate) / new_nr;

    return Book
        .updateOne({isbn: isbn},{$set: {
            "rate.num_rates": new_nr,
            "rate.current_rate": new_cr
        }})
        .exec();
}

// Update book rate
module.exports.update_rate = async (isbn, rate, old_rate) => {
    
    const bookdata = await Book.findOne({isbn: isbn},{ "rate":1 }).exec();
    const new_cr = bookdata.rate.current_rate + (rate - old_rate) / bookdata.rate.num_rates;

    return Book
        .updateOne({isbn: isbn},{$set: {
            "rate.current_rate": new_cr
        }})
        .exec();
}

// Check if a book exists
module.exports.exists = async (isbn) => {
    let val = await Book
        .countDocuments({ isbn: isbn })
        .exec();
    return val > 0;
}

// Check if multiple books exists
module.exports.multiple_exists = async (books_isbn) => {
    let val = await Book
        .countDocuments({ isbn: { "$in": books_isbn } })
        .exec()
    return val == books_isbn.length;
}