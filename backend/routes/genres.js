const express = require('express');
const Genre = require('../controllers/genre');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');

const router = express.Router();


router.get('/genres', auth.authenticate(CPermissions.amm), async (req, res) => {
    Genre.list_all()
    .then(genresdata => {
        res.json({ "genres": genresdata });
    })
    .catch(err => {
        res.status(500).json({ "error": err.message });
    });
});

module.exports = router;