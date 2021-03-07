const User = require('../models/user');
const crypto = require('crypto');
const mongoose = require('mongoose');

// =========================== // User CRUD operations

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
            .findOne({ username: username },{_id:0})
            .exec();
    }
    else
    {
        return User
            .findOne({ username: username },{_id:0,password_hash:0})
            .exec();
    }
}

// Inserts a new user
module.exports.insert = (userdata) => {
    let new_user = new User(userdata);
    return new_user.save()
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
    let userdata = await this.get(username)
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