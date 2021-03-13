const express = require('express');
const Author = require('../controllers/author');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
//const { Regex } = require('../controllers/validation');

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
router.get('/authors', auth.authenticate(Permissions.Member), (req, res) => {
    Author.list_all()
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
router.get('/authors/:name', auth.authenticate(Permissions.Member), (req, res) => {
    Author.get(req.params.name)
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

module.exports = router;