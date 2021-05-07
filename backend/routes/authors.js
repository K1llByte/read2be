const express = require('express');
const Author = require('../controllers/author');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');

const router = express.Router();


/**
 * @swagger
 * /authors:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Author
 *    summary: List authors
 *    description: List authors
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/authors', auth.authenticate(CPermissions.amm), (req, res) => {

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

    Author.list_all(options)
    .then(authorsdata => {
        res.json({ "authors": authorsdata });
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /authors/{name}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Author
 *    summary: Get author
 *    description: Get author by name
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Author name
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Author not found
 */
router.get('/authors/:name', auth.authenticate(CPermissions.amm), (req, res) => {
    const options = {
        inline_books: req.query.inline_books,
    }

    Author.get(req.params.name,options)
    .then(authordata => {
        if(authordata != null)
        {
            res.json(authordata);
        }
        else
        {
            res.status(404).json({ "error": "Author not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /authors:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Author
 *    summary: Add an author
 *    description: Add an author data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: formData
 *        required: true
 *        description: Author name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Author books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Author data added successfully
 *      '400':
 *        description:
 *          Invalid name,
 *          Invalid books,
 *          Author could not be added
 */
router.post('/authors', auth.authenticate(Permissions.Admin), async (req, res) => {
    let author = {
        "name": req.body.name,
        "books": req.body.books || []
    };

    if(author.name == undefined)
    {
        res.status(400).json({ "error": "Invalid name" });
        return;
    }

    if(!Array.isArray(author.books))
    {
        res.status(400).json({ "error": "Invalid books" });
        return;
    }

    try
    {
        let exists = await Author.exists(author.name);
        if(exists)
        {
            res.status(400).json({ "error": "Author already exists" });
        }
        else
        {
            let authordata = await Author.insert(author)
            if(authordata != null)
            {
                res.json({ "success": "Author data added successfully" });
            }
            else
            {
                res.status(400).json({ "error": "Author could not be added" });
            }
        }
    }
    catch(err) {
        res.status(500).json({ "error": err.message });
    }
});


/**
 * @swagger
 * /authors/{name}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Author
 *    summary: Delete an author
 *    description: Delete author data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Author name
 *        type: string
 *    responses:
 *      '200':
 *        description: Author data deleted successfully
 *      '404':
 *        description: Author not found
 */
router.delete('/authors/:name', auth.authenticate(Permissions.Admin), (req, res) => {
    Author.delete(req.params.name)
    .then(info => {
        if(info.deletedCount > 0)
        {
            res.json({ "success": "Author data deleted successfully" });
        }
        else
        {
            res.status(404).json({ "error": "Author not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /authors/{name}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Author
 *    summary: Update author data
 *    description: Update author data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Author name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Author books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Author data updated successfully
 *      '400':
 *        description:
 *          Invalid books,
 *          Author didn't change
 *      '404':
 *        description: Author not found
 */
router.put('/authors/:name', auth.authenticate(Permissions.Admin), (req, res) => {
    const books = req.body.books;

    if(books === undefined || !Array.isArray(books))
    {
        res.status(400).json({ "error": "Invalid books" });
        return;
    }

    Author.set(req.params.name,{books:books})
    .then(info => {
        if(info.n === 0)
        {
            res.status(404).json({ "error": "Author not found" });
        }
        else if(info.nModified === 0)
        {
            res.status(400).json({ "error": "Author didn't change" });
        }
        else
        {
            res.json({ "success": "Author data updated successfully" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

module.exports = router;