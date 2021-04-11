const express = require('express');
const User = require('../controllers/user');
const Status = require('../controllers/status');
const Book = require('../controllers/book');
const { Permissions, CPermissions } = require('../controllers/user');
const auth = require('../controllers/auth');
const { Regex } = require('../controllers/validation');

const router = express.Router();


/**
 * @swagger
 * /users:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: List users
 *    description: List users
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Successful
 */
router.get('/users', auth.authenticate(CPermissions.amm), (req, res) => {
    
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

    User.list_all(options)
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
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Get user
 *    description: Get user by username
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: User not found
 */
router.get('/users/:username', auth.authenticate(CPermissions.amm), (req, res) => {
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


/**
 * @swagger
 * /users/{username}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Update user
 *    description: Update user data
 *    produces: application/json
 *    parameters:
 *      - name: nickname
 *        in: formData
 *        required: false
 *        description: Nickname
 *        type: string
 *      - name: email
 *        in: formData
 *        required: false
 *        description: Email
 *        type: string
 *      - name: password
 *        in: formData
 *        required: false
 *        description: Password
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description:
 *          Invalid nickname,
 *          Invalid email,
 *          Invalid password,
 *          No user data to update
 *      '401':
 *        description: Forbidden
 */
router.patch('/users/:username', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        // TODO: change avatar
        let userdata = {};
        let any = false

        if(req.body.nickname)
        {
            if(req.body.nickname.match(Regex.NICKNAME))
            {
                userdata.nickname = req.body.nickname;
                any = true;
            }
            else
            {
                res.status(400).json({ "error": "Invalid nickname" });
                return;
            }
        }

        if(req.body.email)
        {
            if(req.body.email.match(Regex.EMAIL))
            {
                userdata.email = req.body.email;
                any = true;
            }
            else
            {
                res.status(400).json({ "error": "Invalid email" });
                return;
            }
        }

        if(req.body.password)
        {
            if(req.body.password.match(Regex.WEAK_PASSWD))
            {
                try {
                    userdata.password_hash = await User.gen_password_hash(req.body.password);
                } catch(err) {
                    res.status(500).json({ "error": err.message });
                    return;
                }
                any = true;
            }
            else
            {
                res.status(400).json({ "error": "Invalid password" });
                return;
            }
        }

        if(any)
        {
            User.set(target_username,userdata)
            .then(data => {
                res.json({ "success": "User updated" });
            })
            .catch(err => {
                res.status(500).json({ "error": err.message });
            });
        }
        else
        {
            res.status(400).json({ "error": "No user data to update" });
        }
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Delete user
 *    description: Delete user
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: User deleted successfully
 *      '401':
 *        description: Forbidden
 */
router.delete('/users/:username', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.delete(target_username)
        .then(info => {
            console.log(info);
            res.json({ "success": "User deleted successfully" });
        })
        .catch(err => {
            res.status(500).json({ "error": err.message })
        });
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}/avatar:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Get user avatar image
 *    description: Get user avatar image
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: User username
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '404':
 *        description: User not found
 */
router.get('/users/:username/avatar', auth.authenticate(CPermissions.amm), (req, res) => {
    User.get(req.params.username)
    .then(userdata => {
        if(userdata != null)
        {
            res.redirect( 
                (userdata.avatar_url == "")
                    ? '/storage/users/default.png'
                    : userdata.avatar_url
            );
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


/**
 * @swagger
 * /users/{username}/books:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Add book to user
 *    description: Add book to user collection
 *    produces: application/json
 *    parameters:
 *      - name: isbn
 *        in: formData
 *        required: true
 *        description: ISBN of book to add
 *        type: string
 *      - name: status
 *        in: formData
 *        required: true
 *        description: Status
 *        type: number
 *      - name: rate
 *        in: formData
 *        required: true
 *        description: Rated value
 *        type: number
 *    responses:
 *      '200':
 *        description: Book added successfully
 *      '400':
 *        description: 
 *          Invalid isbn,
 *          Invalid status,
 *          Invalid rate
 *      '401':
 *        description: Forbidden
 */
router.post('/users/:username/books', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        let bookdata = {
            isbn:   req.body.isbn,
            status: Number(req.body.status,10),
            rate:   Number(req.body.rate,10),
            date_registered: Date.now()
        }

        let book_exists_p = Book.exists(bookdata.isbn);
        let has_book_p = User.has_book(target_username,bookdata.isbn);
        let status_exists_p = Status.exists(bookdata.status || 0);

        // Check if isbn of book exists in database, 
        // and if it wasn't already added in this user
        if(!(await book_exists_p))
        {
            res.status(400).json({ "error": "Invalid isbn" });
            return;
        }
        if(await has_book_p)
        {
            res.status(400).json({ "error": "Book already registered" });
            return;
        }

        // Check if status exists
        if(!(await status_exists_p))
        {
            res.status(400).json({ "error": "Invalid status" });
            return;
        }

        // Check rate bounds
        if(isNaN(bookdata.rate) || bookdata.rate < 0 || bookdata.rate > 10)
        {
            res.status(400).json({ "error": "Invalid rate" });
            return;
        }

        User.add_book(target_username,bookdata)
        .then(data => {
            res.json({ "success": "Book added successfully" });
        })
        .catch(err => {
            res.status(500).json({ "error": err.message });
        });
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}/books/{isbn}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Remove book from user
 *    description: Remove book from user collection
 *    produces: application/json
 *    responses:
 *      '200':
 *        description: Removed book from list successfully
 *      '400':
 *        description: 
 *          Book not in user list
 *      '401':
 *        description: Forbidden
 */
router.delete('/users/:username/books/:isbn', auth.authenticate(CPermissions.amm), (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.remove_book(target_username,req.params.isbn)
        .then(info => {
            if(info.nModified != 0)
            {
                res.json({ "success": "Removed book from list successfully" });
            }
            else
            {
                res.status(400).json({ "error": "Book not in user list" });
            }
        })
        .catch(err => {
            res.status(500).json({ "error": err.message });
        });
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}/books/{isbn}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Update user book
 *    description: Update user book data
 *    produces: application/json
 *    parameters:
 *      - name: status
 *        in: formData
 *        required: false
 *        description: Status
 *        type: integer
 *      - name: rate
 *        in: formData
 *        required: false
 *        description: Rate
 *        type: integer
 *    responses:
 *      '200':
 *        description: Successful
 *      '400':
 *        description:
 *          Invalid status,
 *          Invalid rate,
 *          No book data to update
 *      '401':
 *        description: Forbidden
 */
router.patch('/users/:username/books/:isbn', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        let bookdata = {};
        let any = false;

        const status = Number(req.body.status,10);
        let status_exists_p =  Status.exists(status || 0);

        if(req.body.status)
        {
            if(! isNaN(status) && (await status_exists_p))
            {
                bookdata.status = status;
                any = true;
            }
            else
            {
                res.status(400).json({ "error": "Invalid status" });
                return;
            }
        }
        
        if(req.body.rate)
        {
            const rate = Number(req.body.rate,10);
            if(!isNaN(rate) && (rate >= 0 && rate <= 10))
            {
                bookdata.rate = rate;
                any = true;
            }
            else
            {
                res.status(400).json({ "error": "Invalid rate" });
                return;
            }
        }

        if(any)
        {
            User.update_book(target_username,req.params.isbn,bookdata)
            .then(info => {
                res.json({ "success": "User book information updated successfully" });
            })
            .catch(err => {
                res.status(500).json({ "error": err.message });
            });
        }
        else
        {
            res.status(400).json({ "error": "No book data to update" });
        }
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}/requests/{friend_user_id}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Update friend request
 *    description: Accept or reject  friend request
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: friend_user_id
 *        in: path
 *        required: true
 *        description: User ID of friend request
 *        type: string
 *      - name: accept
 *        in: formData
 *        required: false
 *        default: true
 *        description: Accept or not friend request
 *        type: boolean
 *    responses:
 *      '200':
 *        description: Friend request updated successfully
 *      '400':
 *        description: No pending request for 'friend_user_id'
 *      '401':
 *        description: Forbidden
 */
router.patch('/users/:username/requests/:friend_user_id', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        const accept = req.body.accept || true;
        User.update_request(target_username, req.user.user_id, req.params.friend_user_id, accept)
        .then(() => {
            res.json({ "success": "Friend request updated successfully" });
        })
        .catch(err => {
            res.status(400).json({ "error": err.message });
        });
    }
    else
    {
        res.status(401).json({ "error": "Forbidden" });
    }
});


/**
 * @swagger
 * /users/{username}/requests:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Add friend request
 *    description: Send a friend request to a user
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *    responses:
 *      '200':
 *        description: Friend request updated successfully
 *      '400':
 *        description: No pending request for 'friend_user_id'
 */
router.post('/users/:username/requests', auth.authenticate(CPermissions.amm), async (req, res) => {

    User.add_request(req.params.username,req.user.username,req.user.user_id)
    .then(() => {
        res.json({ "success": "Friend request added successfully" });
    })
    .catch(err => {
        res.status(400).json({ "error": err.message });
    });
});

module.exports = router;