const User = require('../models/user');
const crypto = require('crypto');
const mongoose = require('mongoose');

// =========================== // User CRUD operations

// Inserts a new user
module.exports.insert = (userdata) => {
    let new_user = new User(userdata);
    return new_user.save()
}

// List all users
module.exports.list_all = (options={}) => {
    const page_limit = options.page_limit || 20;
    const page_num = options.page_num || 0;
    return User
        .find({},{_id:0,password_hash:0})
        .skip(page_num > 0 ? ( ( page_num - 1 ) * page_limit ) : 0)
        .limit(page_limit)
        .exec();
}

// Get a user by id
module.exports.get = (username,no_password=false) => {
    if(no_password)
    {
        return User
            .findOne({ username: username },{_id:0,password_hash:0})
            .exec();
    }
    else
    {
        return User
            .findOne({ username: username },{_id:0})
            .exec();
    }
}

// Update user data
module.exports.set = (username,userdata) => {
    return User
        .updateOne({username:username},{$set : userdata})
        .exec();
}

// Delete user data
module.exports.delete = (username,userdata) => {
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
module.exports.verify_password = async (username,in_password) => {
    let userdata = await this.get(username,false)
    if(userdata != null)
    {
        console.log("userdata.password_hash",userdata.password_hash);
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

// Check if users already has a book
module.exports.has_book = async (username,isbn) => {
    let val = await User
        .countDocuments({ 
            "username": username,
            "books.isbn":isbn }
        )
        .exec();
    return val > 0;
}

// Add book to user book list
module.exports.add_book = (username,bookdata) => {
    return User.updateOne(
        { username: username },
        { $push : { books: bookdata} }
    ).exec();
}

// Remove book from user list
module.exports.remove_book = (username,isbn) => {
    return User.updateOne(
        { username: username },
        { $pull: { books: { isbn: isbn } } }
    ).exec();
}

// Update book from user list
module.exports.update_book = (username,isbn,bookdata) => {

    let set_query = {};
    if(bookdata.status)
        set_query['books.$.status'] = bookdata.status;
    if(bookdata.rate)
        set_query['books.$.rate'] = bookdata.rate;

    return User.updateOne(
        { 
            "username": username,
            "books.isbn": isbn
        },
        { "$set" : set_query }
    ).exec();
}

// Add friendship request
module.exports.add_request = async (username,friend_username,friend_user_id) => {
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
module.exports.update_request = async (username,user_id,friend_user_id,accept) => {
    // User1 - User who received the friend request
    // User2 - User who sent the friend request
    
    // Remove request from User1's pending 
    // requests list
    console.log(`username: ${username} , friend_user_id: ${friend_user_id}`)
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
    ap :  (this.Permissions.Admin | this.Permissions.Producer),
    apc : (this.Permissions.Admin | this.Permissions.Producer | this.Permissions.Consumer)
});


// db.users.updateOne({username:"a85272"},{$push:{pending:"6044da5949805a4477fdcd2e"}})
// .countDocuments({username: "a85272",friends:{"$elemMatch":{"$eq":"6044da5949805a4477fdcd2e"}},pending:{"$elemMatch":{"$eq":"6044da5949805a4477fdcd2e"}}});