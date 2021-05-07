const express = require('express');
const Publisher = require('../controllers/publisher');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
//const { Regex } = require('../controllers/validation');

const router = express.Router();


/**
 * @swagger
 * /publishers:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Publisher
 *    summary: List publishers
 *    description: List publishers
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/publishers', auth.authenticate(CPermissions.amm), (req, res) => {
    
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

    Publisher.list_all(options)
    .then(publisherdata => {
        res.json({ "publishers": publisherdata });
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /publishers/{name}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Publisher
 *    summary: Get publisher
 *    description: Get publisher by name
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Publisher name
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Publisher not found
 */
router.get('/publishers/:name', auth.authenticate(CPermissions.amm), (req, res) => {
    const options = {
        inline_books: req.query.inline_books,
    }

    Publisher.get(req.params.name,options)
    .then(publisherdata => {
        if(publisherdata != null)
        {
            res.json(publisherdata);
        }
        else
        {
            res.status(404).json({ "error": "Publisher not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /publishers:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Publisher
 *    summary: Add a publisher
 *    description: Add publisher data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: formData
 *        required: true
 *        description: Publisher name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Publisher books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Publisher data added successfully
 *      '400':
 *        description:
 *          Invalid name,
 *          Invalid books,
 *          Publisher could not be added
 */
router.post('/publishers', auth.authenticate(Permissions.Admin), async (req, res) => {
    let publisher = {
        "name": req.body.name,
        "books": req.body.books || []
    };

    if(publisher.name == undefined)
    {
        res.status(400).json({ "error": "Invalid name" });
        return;
    }

    if(!Array.isArray(publisher.books))
    {
        res.status(400).json({ "error": "Invalid books" });
        return;
    }

    try
    {
        let exists = await Publisher.exists(publisher.name);
        if(exists)
        {
            res.status(400).json({ "error": "Publisher already exists" });
        }
        else
        {
            let publisherdata = await Publisher.insert(publisher)
            if(publisherdata != null)
            {
                res.json({ "success": "Publisher data added successfully" });
            }
            else
            {
                res.status(400).json({ "error": "Publisher could not be added" });
            }
        }
    }
    catch(err) {
        res.status(500).json({ "error": err.message });
    }
});


/**
 * @swagger
 * /publishers/{name}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Publisher
 *    summary: Delete a publisher
 *    description: Delete publisher data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Publisher name
 *        type: string
 *    responses:
 *      '200':
 *        description: Publisher data deleted successfully
 *      '404':
 *        description: Publisher not found
 */
router.delete('/publishers/:name', auth.authenticate(Permissions.Admin), (req, res) => {
    Publisher.delete(req.params.name)
    .then(info => {
        if(info.deletedCount > 0)
        {
            res.json({ "success": "Publisher data deleted successfully" });
        }
        else
        {
            res.status(404).json({ "error": "Publisher not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /publishers/{name}:
 *  put:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - Publisher
 *    summary: Update publisher data
 *    description: Update publisher data
 *    produces: application/json
 *    parameters:
 *      - name: name
 *        in: path
 *        required: true
 *        description: Publisher name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Publisher books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Publisher data updated successfully
 *      '400':
 *        description:
 *          Invalid books,
 *          Publisher didn't change
 *      '404':
 *        description: Publisher not found
 */
router.put('/publishers/:name', auth.authenticate(Permissions.Admin), (req, res) => {
    const books = req.body.books;

    if(books === undefined || !Array.isArray(books))
    {
        res.status(400).json({ "error": "Invalid books" });
        return;
    }

    Publisher.set(req.params.name,{books:books})
    .then(info => {
        if(info.n === 0)
        {
            res.status(404).json({ "error": "Publisher not found" });
        }
        else if(info.nModified === 0)
        {
            res.status(400).json({ "error": "Publisher didn't change" });
        }
        else
        {
            res.json({ "success": "Publisher data updated successfully" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

module.exports = router;