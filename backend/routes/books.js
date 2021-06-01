const express = require('express');
const Book = require('../controllers/book');
const Genre = require('../controllers/genre');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
const { upload, save_cover, delete_file, delete_book_storage } = require('../controllers/storage');
const axios = require('axios');
//const { Regex } = require('../controllers/validation');

const router = express.Router();


/**
 * @swagger
 * /books:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: List books
 *    description: List books
 *    produces: application/json
 *    parameters:
 *      - name: page_num
 *        in: query
 *        required: false
 *        description: Select page from books list
 *        type: number
 *      - name: page_limit
 *        in: query
 *        required: false
 *        description: Select number of books per page
 *        type: number
 *      - name: search
 *        in: query
 *        required: false
 *        description: Search query
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/books', auth.authenticate(CPermissions.amm), async (req, res) => {
    // TODO: Input validation on 'search'
    let options = {};

    if(req.query.page_num != undefined)
    {
        options.page_num = Number(req.query.page_num);
        if(!Number.isInteger(options.page_num))
        {
            res.status(400).json({'error': "Invalid page_num"});
            return;
        }
    }

    if(req.query.page_limit != undefined)
    {
        options.page_limit = Number(req.query.page_limit);
        if(!Number.isInteger(options.page_limit))
        {
            res.status(400).json({'error': "Invalid page_limit"});
            return;
        }
    }

    if(req.query.q != undefined)
    {
        options.search_query = req.query.q;
    }

    if(req.query.sort_by != undefined)
    {
        options.sort_by = req.query.sort_by;
        if(!["published_year","title"].includes(options.sort_by))
        {
            res.status(400).json({'error': "Invalid sort_by"});
            return;
        }
    }

    if(req.query.order != undefined)
    {
        options.order = Number(req.query.order);
        if(!Number.isInteger(options.order) || !(options.order in [-1,1] ))
        {
            res.status(400).json({'error': "Invalid order"});
            return;
        }
    }
    else
    {
        options.order = -1;
    }

    if(req.query.genre != undefined)
    {
        options.genre = await Genre.get_id(req.query.genre);
        if(options.genre === null)
        {
            res.status(400).json({'error': "Invalid genre"});
            return;
        }
        else
            options.genre = options.genre["genre_id"]
    }
    
    // If the 'search_query' parameter is set, then its a search,
    // otherwise, is just a listing of all books.
    Book.list_all(options)
    .then(booksdata => {
        res.json(booksdata);
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /books/{isbn}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: Get book
 *    description: Get book by isbn
 *    produces: application/json
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        description: Book ISBN
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Book not found
 */
router.get('/books/:isbn', auth.authenticate(CPermissions.amm), (req, res) => {
    Book.get(req.params.isbn)
    .then(bookdata => {
        if(bookdata != null)
        {
            res.json(bookdata);
        }
        else
        {
            res.status(404).json({ "error": "Book not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /books:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: Post book data
 *    description: Post book data
 *    produces: application/json
 *    parameters:
 *      - name: book
 *        in: body
 *        required: true
 *        description: Book data
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description: Invalid cover image
 */
router.post('/books', auth.authenticate(Permissions.Admin), upload.single('cover'), (req, res) => {
    if(!req.valid_file && req.file !== undefined)
    {
        res.status(400).json({ "error": "Invalid cover file" });
        return;
    }

    const book = {
        "isbn": req.body.isbn,
        "title": req.body.title,
        "authors": req.body.authors,
        "publisher": req.body.publisher,
        "genres": req.body.genres,
        "language": req.body.language,
        "description": req.body.description,
        "published_year": req.body.published_year,
        "cover_url": req.body.cover_url,
    };

    // TODO: Input validation (and type checking)
    if( book.isbn        == undefined ||
        book.title       == undefined ||
        book.authors     == undefined ||
        book.publisher   == undefined ||
        book.genres      == undefined ||
        book.language    == undefined ||
        book.description == undefined)
        // published_year can be absent
    {
        delete_file(req.file);
        res.status(400).json({ "error": "Invalid book parameters" });
        return;
    }
    
    if(!book.cover_url)
        book.cover_url = "http://localhost:8080/storage/books/default.jpg"
    
    if(req.file)
        book.cover_url = `http://localhost:8080/storage/books/${book.isbn}/cover.${req.file.ext}`
    
    Book.insert(book)
    .then(bookdata => {
        if(bookdata != null)
        {
            save_cover(book.isbn,req.file);
            res.json(bookdata);
        }
        else
        {
            res.status(400).json({ "error": "Book already exists" });
            delete_file(req.file);
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
        delete_file(req.file);
    });
});


/**
 * @swagger
 * /books/{isbn}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: Delete book data
 *    description: Delete book data
 *    produces: application/json
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        description: Book ISBN
 *        type: string
 *    responses:
 *      '200':
 *        description: Book data deleted successfully
 *      '404':
 *        description: Book not found
 */
router.delete('/books/:isbn', auth.authenticate(Permissions.Admin), (req, res) => {
    Book.delete(req.params.isbn)
    .then(info => {
        if(info.deletedCount > 0)
        {
            delete_book_storage(req.params.isbn);
            res.json({ "success": "Book data deleted successfully" });
        }
        else
        {
            res.status(404).json({ "error": "Book not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /books/{isbn}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: Update book data
 *    description: Update book data
 *    produces: application/json
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        description: Book ISBN
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Book not found
 */
router.patch('/books/:isbn', auth.authenticate(Permissions.Admin), upload.single('cover'), (req, res) => {
    if(!req.valid_file && req.file !== undefined)
    {
        res.status(400).json({ "error": "Invalid cover file" });
        return;
    }

    req.body.isbn = req.params.isbn;

    const book = {
        "isbn": req.body.isbn,
        "title": req.body.title,
        "authors": req.body.authors,
        "publisher": req.body.publisher,
        "genres": req.body.genres,
        "language": req.body.language,
        "description": req.body.description,
        "cover_url": req.body.cover_url
    };

    if(!book.cover_url)
        book.cover_url = "http://localhost:8080/storage/books/default.jpg"
    
    if(req.file)
        book.cover_url = `http://localhost:8080/storage/books/${book.isbn}/cover.${req.file.ext}`

    Book.set(req.params.isbn,book)
    .then(info => {
        if(info.n === 0)
        {
            res.status(404).json({ "error": "Book not found" });
            delete_file(req.file);
        }
        else if(info.nModified === 0 && req.file === undefined)
        {
            res.status(400).json({ "error": "Book didn't change" });
            delete_file(req.file);
        }
        else
        {
            save_cover(book.isbn,req.file);
            
            res.json({ "success": "Book data updated successfully" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
        delete_file(req.file);
    });
});


/**
 * @swagger
 * /books/{isbn}/cover:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Book
 *    summary: Get book cover image
 *    description: Get book cover image
 *    produces: application/json
 *    parameters:
 *      - name: isbn
 *        in: path
 *        required: true
 *        description: Book ISBN
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Book not found
 */
 router.get('/books/:isbn/cover', auth.authenticate(CPermissions.amm), (req, res) => {
    Book.get(req.params.isbn)
    .then(bookdata => {
        if(bookdata != null)
        {
            res.redirect( 
                (bookdata.cover_url == "")
                    ? '/storage/books/default.jpg'
                    : bookdata.cover_url
            );
        }
        else
        {
            res.status(404).json({ "error": "Book not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


router.get('/books/:isbn/recommendations', auth.authenticate(CPermissions.amm), (req, res) => {

    axios.get(`http://localhost:5000/recommender/${req.params.isbn}`)
    .then(res2 => {
        res.status(200).json(res2.data)
    })
    .catch(err => {
        
        if(err.response.status == 404)
        {
            res.status(404).json(err.response.data);
        }
        else
        {
            res.status(500).json({ "error": err.message });
        }
    });
});

module.exports = router;