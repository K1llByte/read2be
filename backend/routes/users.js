const express = require('express');
const User = require('../controllers/user');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');

const router = express.Router();


/**
 * @swagger
 * /users:
 *  post:
 *    summary: List users
 *    description: List users
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/users', (req, res) => {
    User.list_all()
    .then(usersdata => {
        res.json({ "users": usersdata });
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});


/**
 * @swagger
 * /users/{username}:
 *  post:
 *    summary: Get user
 *    description: Get user by username
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: Successful
 */
router.get('/users/:username', auth.authenticate(Permissions.Member), (req, res) => {
    User.get(req.params.username)
    .then(userdata => {
        if(userdata != null)
        {
            res.json(userdata);
        }
        else
        {
            res.status(404).json({ "error": "User not found" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

module.exports = router;