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
router.get('/publishers', auth.authenticate(Permissions.Member), (req, res) => {
    
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
router.get('/publishers/:name', auth.authenticate(Permissions.Member), (req, res) => {
    Publisher.get(req.params.name)
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

module.exports = router;