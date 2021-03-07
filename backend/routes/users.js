const express = require('express');
const User = require('../controllers/user');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');

const router = express.Router();

router.get('/users', (req, res) => {
    User.list_all()
    .then(usersdata => {
        res.json({ "users": usersdata });
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

router.get('/users/:username', auth.authenticate(Permissions.Member), (req, res) => {
    User.get(req.params.username)
    .then(userdata => {
        if(userdata != null)
        {
            res.json(userdata);
        }
        else
        {
            res.status(400).json({ "error": "User doesn't exist" });
        }
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

module.exports = router;