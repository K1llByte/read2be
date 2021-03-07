const express = require('express');
const auth = require('../controllers/auth');
const User = require('../controllers/user');
const { Blacklist } = require('../controllers/blacklist');

const router = express.Router();
var blacklist = new Blacklist();

/**
 * @swagger
 * /login:
 *  post:
 *    description: Login
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/login', (req, res) => {

    console.log(req.body);
    User.verify_password(req.body.username,req.body.password)
        .then(userdata => {
            if(userdata != null)
            {
                const token = auth.gen_token(userdata);
                res.json({ "TOKEN":token });
            }
            else
            {
                res.status(401).json({ "error":"Incorrect credentials" });
            }
        });
});


/**
 * @swagger
 * /logout:
 *  post:
 *    description: Revoke authentication token
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/logout', (req, res) => {

    const token = auth.fetch_token(req);
    if(token == null)
    {
        res.status(401).json({ "error" : "Not logged in" });
    }
    else if(blacklist.has(token))
    {
        res.status(401).json({ "error" : "Token already revoked" });
    }
    else
    {
        blacklist.add(token);
        blacklist.clear();
        res.json({ "success" : "Succsessfully revoked token" });
    }
});


/**
 * @swagger
 * /register:
 *  post:
 *    description: Register an account
 *    responses:
 *      '200':
 *        description: A successful response
 */
router.post('/register', async (req,res) => {
    
    const USERNAME_REGEX = /^(\w|-){1,32}$/;
    const EMAIL_REGEX = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/;
    const WEAK_PASSWD_REGEX = /^(\w|-|\.){8,32}$/
    const STRONG_PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\$%\^&\*])(?=.{8,32})/

    // Input Validation
    if(req.body.username.match(USERNAME_REGEX) &&
        req.body.email.match(EMAIL_REGEX)      &&
        req.body.password.match(WEAK_PASSWD_REGEX))
    {
        // Check if username exists
        User.get(req.body.username)
        .then(data => {
            if(data == null)
            {
                User.gen_password_hash(req.body.password)
                .then(password_hash => {
                    User.insert({
                        "user_id": User.gen_id(),
                        "username": req.body.username,
                        "nickname": "",
                        "password_hash": password_hash,
                        "email": req.body.email,
                        "role": User.Permissions.Member,
                        "avatar_url": "",
                        "books": [],
                        "friends": [],
                        "pending": []
                    });
                    
                    res.json({ "status" : "success" });
                })
                .catch(err => {
                    // TODO: error
                    //console.log(err);
                    res.json({ "status" : err.message });
                })
            }
            else
            {
                // TODO: error
                res.json({ "status" : "User already exists" });
            }
        })
        .catch(err => {
            console.log(err);
            res.json({ "status" : err });
        })
        
    }
    else
    {
        res.json({ "status" : "error" });
    }
});

module.exports = router;