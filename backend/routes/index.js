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
 *    summary: Login
 *    description: Login into the system and returns the authentication token
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: formData
 *        required: true
 *        description: Username
 *        type: string
 *      - name: password
 *        in: formData
 *        required: true
 *        description: Password of the user
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful, Authentication Token
 *      '401':
 *        description: Incorrect credentials
 */
router.post('/login', (req, res) => {

    User.verify_password(req.body.username,req.body.password)
    .then(userdata => {
        if(userdata != null)
        {
            console.log("userdata",userdata);
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
 *    summary: Revoke authentication token
 *    description: Revoke authentication token
 *    parameters:
 *      - name: Authorization
 *        in: header
 *        required: true
 *        description: Bearer Token
 *    responses:
 *      '200':
 *        description: Succsessfully revoked token
 *      '400':
 *        description: Not logged in
 *      '401':
 *        description: Token already revoked
 */
router.post('/logout', (req, res) => {

    const token = auth.fetch_token(req);
    if(token == null)
    {
        res.status(400).json({ "error" : "No Authentication" });
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
 *    summary: Register an account
 *    description: Register an account
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: formData
 *        required: true
 *        description: Username
 *        type: string
 *      - name: password
 *        in: formData
 *        required: true
 *        description: Password for the user
 *        type: string
 *      - name: email
 *        in: formData
 *        required: true
 *        description: Email address
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description: Invalid input
 *      '406':
 *        description: User already exists
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
                    res.status(500).json({ "error" : err.message });
                })
            }
            else
            {
                res.status(406).json({ "error" : "User already exists" });
            }
        })
        .catch(err => {
            res.status(500).json({ "error" : err.message });
        })
        
    }
    else
    {
        res.status(400).json({ "error" : "Invalid input" });
    }
});

module.exports = router;