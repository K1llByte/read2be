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
    Book.list_all()
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