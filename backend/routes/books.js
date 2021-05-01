const express = require('express');
const Book = require('../controllers/book');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
const { upload, save_cover, delete_file, delete_book_storage } = require('../controllers/storage');
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
router.get('/books', auth.authenticate(CPermissions.amm), (req, res) => {
    
    // If the 'search' parameter is set, then its a search,
    // otherwise, is just a listing of all books.
    // TODO: Input validation on 'search'
    const search_query = req.query.search;
    
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

    if(search_query != undefined)
    {
        Book.search(search_query,options)
        .then(booksdata => {
            res.json({ "books": booksdata });
        })
        .catch(err => {
            res.status(500).json({ "error": err.message });
        });
    }
    else
    {
        Book.list_all(options)
        .then(booksdata => {
            res.json({ "books": booksdata });
        })
        .catch(err => {
            res.status(500).json({ "error": err.message });
        });
    }
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
router.post('/books', upload.single('cover'), auth.authenticate(Permissions.Admin), (req, res) => {
    if(!req.valid_file)
    {
        res.status(400).json({ "error": "Invalid cover file" });
        return;
    }

    const book = {
        "isbn": req.body.isbn,
        "title": req.body.title,
        "authors": req.body.authors,
        "publisher": req.body.publisher,
        "genre": req.body.genre,
        "language": req.body.language,
        "cover_url": req.body.cover_url,
    };
    
    // TODO: Input validation (and type checking)
    if( book.isbn      == undefined ||
        book.title     == undefined ||
        book.authors   == undefined ||
        book.publisher == undefined ||
        book.genre     == undefined ||
        book.language  == undefined )
    {
        if(req.file != null)
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
            if(req.file != null)
            {
                save_cover(book.isbn,req.file);
            }
            res.json(bookdata);
        }
        else
        {
            res.status(400).json({ "error": "Book already exists" });
            if(req.file != null)
                delete_file(req.file);
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
        if(req.file != null)
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
 *  put:
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
router.put('/books/:isbn', auth.authenticate(Permissions.Admin), (req, res) => {
    const book = {
        "isbn": req.body.isbn,
        "title": req.body.title,
        "authors": req.body.authors,
        "publisher": req.body.publisher,
        "genre": req.body.genre,
        "language": req.body.language
    };
    
    Book.set(req.params.isbn,book)
    .then(info => {
        if(info.n === 0)
        {
            res.status(404).json({ "error": "Book not found" });
        }
        else if(info.nModified === 0)
        {
            res.status(400).json({ "error": "Book didn't change" });
        }
        else
        {
            res.json({ "success": "Book data updated successfully" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
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

module.exports = router;