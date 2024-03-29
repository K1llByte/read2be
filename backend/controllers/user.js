const User = require('../models/user');
const crypto = require('crypto');
const mongoose = require('mongoose');
const Book = require('../controllers/book');
const Status = require('../controllers/status');

all_status = undefined;

// =========================== // User CRUD operations

// Inserts a new user
module.exports.insert = (userdata) => {
    let new_user = new User(userdata);
    return new_user.save();
}

// List all users
module.exports.list_all = async (options={}) => {
    const page_limit = (options.page_limit != undefined) 
        ? options.page_limit : 20 ;
    const page_num = (options.page_num != undefined) 
        ? options.page_num : 0 ;
    
    return (await User.aggregate([
        { "$project": {"_id":0,password_hash:0} },
        { "$group": { 
                "_id": null,
                "num_pages": { "$sum": 1 }, 
                "users": { "$push": "$$ROOT"  }
            }
        },
        { "$project": { 
                "_id":0,
                "num_pages": {"$ceil":{ "$divide": [ "$num_pages", page_limit ] }},
                "users": { "$slice": [ "$users", (page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0), page_limit ] }
            }
        }
    ]).exec())[0]
}

// Get a user by id
module.exports.get = async (username, options={}) => {
    const BOOK_LOOKUP = {
        "$lookup": {
            "from": "books",
            "localField": "books.isbn",
            "foreignField": "isbn",
            "as": "full_books"
        }
    };

    const STATUS_LOOKUP = {
        "$lookup": {
            "from": "status",
            "localField": "books.status",
            "foreignField": "status_id",
            "as": "status"
        }
    };
    

    const FRIENDS_LOOKUP = {
        "$lookup": {
            "from": "users",
            "localField": "friends",
            "foreignField": "user_id",
            "as": "friends"
        }
    };

    const PENDING_LOOKUP = {
        "$lookup": {
            "from": "users",
            "localField": "pending",
            "foreignField": "user_id",
            "as": "pending"
        }
    };

    
    let PROJECTION = {
        "$project": {
            "_id":0,
            "full_books._id": 0,
            "full_books.reviews": 0,

            "friends._id": 0,
            "friends.friends": 0,
            "friends.pending": 0,
            "friends.password_hash": 0,
            "friends.email": 0,
            "friends.role": 0,
            "friends.books": 0,
            "friends.collections": 0,

            "pending._id": 0,
            "pending.friends": 0,
            "pending.pending": 0,
            "pending.password_hash": 0,
            "pending.email": 0,
            "pending.role": 0,
            "pending.books": 0,
            "pending.collections": 0,
        }
    };

    // let NO_PWD_PROJECTION = {
    //     "$project": {
    //         "_id":0,
    //         "password_hash":0,
    //         "full_books._id": 0,
    //         "full_books.reviews": 0,

    //         "friends._id": 0,
    //         "friends.friends": 0,
    //         "friends.pending": 0,
    //         "friends.password_hash": 0,
    //         "friends.email": 0,
    //         "friends.role": 0,
    //         "friends.books": 0,
    //         "friends.collections": 0,

    //         "pending._id": 0,
    //         "pending.friends": 0,
    //         "pending.pending": 0,
    //         "pending.password_hash": 0,
    //         "pending.email": 0,
    //         "pending.role": 0,
    //         "pending.books": 0,
    //         "pending.collections": 0,
    //     }
    // };
    // let PROJECTION_2 = { "$project": {} }


    let pipeline = [];
    if(options.inline_books == 1)
        pipeline.push(BOOK_LOOKUP);
    

    pipeline.push(FRIENDS_LOOKUP);
    pipeline.push(PENDING_LOOKUP);
    // pipeline.push(STATUS_LOOKUP);
    pipeline.push({ "$match": { username: username } });
    if(!options.with_password)
        PROJECTION['$project']['password_hash'] = 0;
    pipeline.push(PROJECTION);
    
    const tmp = await User.aggregate(pipeline);

    return tmp[0];
}

// Update user data
module.exports.set = (username,userdata) => {
    return User
        .updateOne({username:username},{$set : userdata})
        .exec();
}

// Delete user data
module.exports.delete = (username) => {
    return User
        .deleteOne({username:username})
        .exec();
}

// =========================== // User specific methods

// Generate a User ID
module.exports.gen_id = () => {
    return mongoose.Types.ObjectId().toString('hex');
}

// Digest plaintect password to hash
module.exports.gen_password_hash = async (password) => {
    const SALT_SIZE = 9;
    const salt_bytes = (await crypto.randomBytes(SALT_SIZE)).toString('base64');
    const passwd_hash = crypto.createHash('sha256')
        .update(salt_bytes + password)
        .digest('base64');
    
    return `sha256:${salt_bytes}:${passwd_hash}`;
}

// Parse the hash string to an object
module.exports.parse_password_hash = (password) => {
    const arr = password.split(':');
    return {
        "hash_algorithm" : arr[0],
        "salt"           : arr[1],
        "password_hash"  : arr[2]
    };
}

// Verify user credentials
module.exports.verify_password = async (username, in_password) => {
    let userdata = await this.get(username,{ with_password: true })
    if(userdata != null)
    {
        const passwd_obj = this.parse_password_hash(userdata.password_hash);
        const in_pass_hash = crypto.createHash(passwd_obj.hash_algorithm)
            .update(passwd_obj.salt + in_password)
            .digest('base64');
    
        return (passwd_obj.password_hash === in_pass_hash) ?
            userdata : 
            null;
    }
    else
    {
        return null;
    }
}

// Check if a user exists
module.exports.exists = async (username) => {
    let val = await User
        .countDocuments({ username: username })
        .exec()

    console.log(val);
    return val > 0;
}

// =========================== // User books methods

// Check if user already has a book
module.exports.has_book = async (username, isbn) => {
    let val = await User
        .countDocuments({ 
            "username": username,
            "books.isbn":isbn }
        )
        .exec();
    return val > 0;
}

// Add book to user book list
module.exports.add_book = (username, bookdata) => {
    Book.add_rate(bookdata.isbn, bookdata.rate);

    return User.updateOne(
        { username: username },
        { $push : { books: bookdata} }
    ).exec();
}

// Remove book from user list
module.exports.remove_book = (username, isbn) => {
    return User.updateOne(
        { username: username },
        { $pull: { books: { isbn: isbn } } }
    ).exec();
}

// Update book from user list
module.exports.update_book = async (username, isbn, bookdata) => {

    let set_query = {};
    if(bookdata.status)
        set_query['books.$.status'] = bookdata.status;
    if(bookdata.rate)
        set_query['books.$.rate'] = bookdata.rate;

    let tmp = await User.findOne(
        {username:username},
        {"books":{"$elemMatch":{"isbn":isbn}}}
    ).exec();

    let old_rate = tmp.books[0].rate;

    Book.update_rate(isbn, bookdata.rate, old_rate);

    return User.updateOne(
        { 
            "username": username,
            "books.isbn": isbn
        },
        { "$set" : set_query }
    ).exec();
}

// =========================== // User friendship methods

// Add friendship request
module.exports.add_request = async (username, friend_username, friend_user_id) => {
    // User1 - Friend request target
    // User2 - User who's sending friend request

    // Check if isn't requesting the same user
    if(username == friend_username)
        throw Error("You can't add yourself to your friends list");
    
    // Check if User1 is already friend of User2
    let in_friends_p = User.countDocuments({
        username: username,
        friends: {
            "$elemMatch": {
                "$eq": friend_user_id
            }
        }
    });

    // Check if User1 has a pending request of User2
    let in_pending_p = User.countDocuments({
        username: username,
        pending: {
            "$elemMatch": {
                "$eq": friend_user_id
            }
        }
    });

    if((await in_friends_p) == 1)
        throw Error("User already in friends list");
    if((await in_pending_p) == 1)
        throw Error("Friend request already sent");

    let user_id = (await User.findOne(
        {username: username},
        {_id:0,user_id:1}
    )
    .exec()).user_id;

    try {
        await this.update_request(friend_username,friend_user_id,user_id,true);
    }
    catch(err) {
        
        // Add friend request to User1
        await User.updateOne(
            { username: username },
            { $push: { pending: friend_user_id } }
        ).exec();
    }
}

// Update friendship request
module.exports.update_request = async (username, user_id, friend_user_id, accept) => {
    // User1 - User who received the friend request
    // User2 - User who sent the friend request
    
    // Remove request from User1's pending 
    // requests list
    let info = await User.updateOne(
        { username: username },
        { $pull: { pending: friend_user_id } }
    ).exec();
    
    if(accept)
    {
        if(info.nModified == 1)
        {
            // Add User2 to User1's friend list
            var u1_add_u2_p = User.updateOne(
                { user_id: user_id },
                { $push: { friends: friend_user_id } }
            ).exec();
            // Add User1 to User2's friend list
            var u2_add_u1_p = User.updateOne(
                { user_id: friend_user_id },
                { $push: { friends: user_id } }
            ).exec();
        }
        else
        {
            throw Error("No pending request for 'friend_user_id'");
        }
        
        let u1_add_u2 = (await u1_add_u2_p);
        let u2_add_u1 = (await u2_add_u1_p);
    }
}

// End friendship
module.exports.delete_friend = async (username, user_id, friend_user_id) => {
    // User1 - User who wants to end relationship :(
    // User2 - Target user
    
    // Remove User2 from User1's friends 
    let info1 = await User.updateOne(
        { username: username },
        { $pull: { friends: friend_user_id } }
    ).exec();

    if(info1.nModified !== 1)
    {
        throw Error("No friend for that 'friend_user_id'");
    }

    // Remove User2 from User1's friends 
    let info2 = await User.updateOne(
        { user_id: friend_user_id },
        { $pull: { friends: user_id } }
    ).exec();
}

// =========================== // User collections methods

// Check if user already has a collection
module.exports.has_collection = async (username, name) => {
    let val = await User
        .countDocuments({ 
            "username": username,
            "collections.name": name }
        )
        .exec();
    return val > 0;
}

// Add a collection
module.exports.add_collection = async (username, collection_data) => {

    // Check if user has a collection with name 'collection_name'
    if (await this.has_collection(username,collection_data.name))
    {
        throw Error("User has a collection with same name");
    }

    return User.updateOne(
        { username: username },
        { $push : { collections: collection_data} }
    ).exec();
}

// Get a collection by name
module.exports.get_collection = (username, collection_name) => {
    return User.findOne({
        username: username,
        "collections.name": collection_name
    },{
        "_id":0,
        "collection": {
            "$arrayElemAt":["$collections", 0]
        }
    }).exec()
}

// Update collection name & avatar
module.exports.update_collection = async (username, collection_name, new_name) => {
    
    // Check if user has a collection with name 'collection_name'
    if (!await this.has_collection(username,collection_name))
    {
        throw Error("User has no such collection");
    }

    if (await this.has_collection(username,new_name))
    {
        throw Error("User has a collection with same name");
    }

    return User.updateOne(
        { username: username, "collections.name": collection_name },
        { $set: { "collections.$.name" : new_name } }
    ).exec();
}

// Delete a collection
module.exports.delete_collection = async (username, collection_name) => {

    // Check if user has a collection with name 'collection_name'
    if (!await this.has_collection(username,collection_name))
    {
        throw Error("User has no such collection");
    }

    return User.updateOne(
        { username: username },
        {
            "$pull": {
                "collections": { "name": collection_name }
        }
    }).exec()
}

// Add book(s) to collection
module.exports.add_to_collection = async (username, collection_name, books_isbn) => {
    
    // Check if user has a collection with name 'collection_name'
    if (!await this.has_collection(username, collection_name))
    {
        throw Error("User has no such collection");
    }

    // Check if books exist in the database
    if(!await Book.multiple_exists(books_isbn))
    {
        throw Error(`Not every book exists`);
    }

    // Remove books to be inserted, to ensure there's no duplicates
    User.updateMany(
        { username: username, "collections.name": collection_name },
        { "$pullAll": { "collections.$.books": books_isbn } }
    ).exec();

    return User.updateMany(
        { username: username, "collections.name": collection_name },
        { "$push": { "collections.$.books": { "$each": books_isbn } } }
    ).exec();
}

// Remove book(s) from collection
module.exports.remove_from_collection = async (username, collection_name, books_isbn) => {

    if (!await this.has_collection(username, collection_name))
    {
        throw Error("User has no such collection");
    }

    return User.updateMany(
        { username: username, "collections.name": collection_name },
        { "$pullAll": { "collections.$.books": books_isbn } }
    ).exec();
}

// =========================== // 
  
// Permissions Enum
module.exports.Permissions = Object.freeze({
    Guest :       0b00000000,
    Member :      0b00000001,
    Mod :         0b00000010,
    Admin :       0b10000000
});


// Compound Permissions Enum
module.exports.CPermissions = Object.freeze({
    am :  (this.Permissions.Admin | this.Permissions.Member),
    amm : (this.Permissions.Admin | this.Permissions.Member | this.Permissions.Mod)
});