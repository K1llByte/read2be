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
    const options = {
        inline_books: req.query.inline_books,
    };

    User.get(req.params.username, options)
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
                (userdata.avatar_url === "")
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


/**
 * @swagger
 * /users/{username}/collections:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Add collection
 *    description: Add a new collection to user collections list
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: formData
 *        required: true
 *        description: Collection name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Collection books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Collection added successfully
 *      '400':
 *        description: Invalid name
 *      '401':
 *        description: Forbidden
 */
router.post('/users/:username/collections', auth.authenticate(CPermissions.amm), async (req, res) => {

    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        const collection = {
            name: req.body.name,
            thumbnail_url: "",
            books: req.body.books
        };

        if(!collection.name.match(Regex.COLLECTION_NAME))
        {
            res.status(400).json({ "error": "Invalid name" });
            return;
        }

        User.add_collection(target_username, collection)
        .then(() => {
            res.json({ "success": "Collection added successfully" });
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
 * /users/{username}/collections/{name}:
 *  get:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Get collection
 *    description: Get collection data
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: path
 *        required: true
 *        description: Collection name
 *        type: string
 *    responses:
 *      '200':
 *        description: Successful
 *      '401':
 *        description: Forbidden
 */
router.get('/users/:username/collections/:name', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.get_collection(target_username, req.params.name)
        .then(data => {
            res.json(data);
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
 * /users/{username}/collections/{name}:
 *  patch:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Update collection name
 *    description: Update collection name
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: path
 *        required: true
 *        description: Collection name
 *        type: string
 *      - name: new_name
 *        in: formData
 *        required: true
 *        description: New collection name
 *        type: string
 *    responses:
 *      '200':
 *        description: Collection updated successfully
 *      '400':
 *        description: Invalid new_name
 *      '401':
 *        description: Forbidden
 */
router.patch('/users/:username/collections/:name', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        const new_name = req.body.new_name;
        if(!new_name.match(Regex.COLLECTION_NAME))
        {
            res.status(400).json({ "error": "Invalid new_name" });
            return;
        }

        User.update_collection(target_username, req.params.name, new_name)
        .then(info => {
            res.json({ "success": "Collection updated successfully" });
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
 * /users/{username}/collections/{name}:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Delete a collection
 *    description: Delete a collection by name
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: path
 *        required: true
 *        description: Collection name
 *        type: string
 *    responses:
 *      '200':
 *        description: Collection deleted successfully
 *      '401':
 *        description: Forbidden
 */
router.delete('/users/:username/collections/:name', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.delete_collection(target_username, req.params.name)
        .then(info => {
            res.json({ "success": "Collection deleted successfully" });
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
 * /users/{username}/collections/{name}:
 *  post:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Add book to collection 
 *    description: Add book to collection, multiple isbn's as a list 
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: path
 *        required: true
 *        description: Collection name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Collection books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Book(s) added successfully to collection
 *      '401':
 *        description: Forbidden
 */
router.post('/users/:username/collections/:name', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.add_to_collection(target_username, req.params.name, req.body.books)
        .then(info => {
            res.json({ "success": "Book(s) added successfully to collection" });
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
 * /users/{username}/collections/{name}/books:
 *  delete:
 *    security:
 *      - bearerAuth: []
 *    tags:
 *      - User
 *    summary: Remove book from collection
 *    description: Remove book from collection, multiple isbn's as a list 
 *    produces: application/json
 *    parameters:
 *      - name: username
 *        in: path
 *        required: true
 *        description: Username
 *        type: string
 *      - name: name
 *        in: path
 *        required: true
 *        description: Collection name
 *        type: string
 *      - name: books
 *        in: body
 *        required: true
 *        description: Collection books list
 *        type: array
 *        items:
 *          type: string
 *    responses:
 *      '200':
 *        description: Book(s) added successfully to collection
 *      '401':
 *        description: Forbidden
 */
router.delete('/users/:username/collections/:name/books', auth.authenticate(CPermissions.amm), async (req, res) => {
    const target_username = req.params.username;
    if(target_username === req.user.username)
    {
        User.remove_from_collection(target_username, req.params.name, req.body.books)
        .then(info => {
            res.json({ "success": "Book(s) removed successfully from collection" });
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

module.exports = router;