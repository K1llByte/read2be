const express = require('express');
const Book = require('../controllers/book');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
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
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/books', auth.authenticate(Permissions.Member), (req, res) => {
    
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

    Book.list_all(options)
    .then(booksdata => {
        res.json({ "books": booksdata });
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
router.get('/books/:isbn', auth.authenticate(Permissions.Member), (req, res) => {
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
router.post('/books', auth.authenticate(Permissions.Admin), (req, res) => {
    const book = {
        "isbn": req.body.isbn,
        "title": req.body.title,
        "authors": req.body.authors,
        "publisher": req.body.publisher,
        "genre": req.body.genre,
        "language": req.body.language
    };

    // TODO: Input validation
    if( book.isbn === undefined ||
        book.title === undefined ||
        book.authors === undefined ||
        book.publisher === undefined ||
        book.genre === undefined ||
        book.language === undefined)
    {
        res.status(400).json({ "error": "Invalid book parameters" });
        return;
    }

    Book.insert(book)
    .then(bookdata => {
        console.log("bookdata",bookdata);
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
router.get('/books/:isbn/cover', auth.authenticate(Permissions.Member), (req, res) => {
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