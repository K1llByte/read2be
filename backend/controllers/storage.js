const multer = require('multer');
const fs = require('fs');
const path = require('path');

// =========================== // Multer properties

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'storage/uploads/');
    },
    filename: (req, file, cb) => {
        const tmp = file.originalname.split('.');
        file.ext = (tmp.length == 1) ? 
            null : tmp[tmp.length-1];
        cb(null, file.fieldname + '-' + Date.now());
    }
});

const img_type_filter = (req,file,next) => {
    req.valid_file = (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png');
    next(null,req.valid_file);
};

module.exports.upload = multer({
    storage: storage,
    limits : {
        fileSize : 1024 * 1024 * 1 // 1Mb size limit
    },
    fileFilter: img_type_filter,
});

// =========================== //

// Save book cover
module.exports.save_cover = (isbn, file) => {
    if(file != null)
    {
        this.create_book_storage(isbn);
        file.new_path = `storage/books/${isbn}/cover.${file.ext}`;
        fs.renameSync(file.path, file.new_path);
    }
}

// Save user avatar
module.exports.save_avatar = (username, file) => {
    if(file != null)
    {
        this.create_user_storage(username);
        file.new_path = `storage/users/${username}/avatar.${file.ext}`;
        fs.renameSync(file.path, file.new_path);
    }
}

// Delete file
module.exports.delete_file = (file) => {
    if(file != null)
    {
        fs.rmSync(file.path);
    }
}

// Create book storage
module.exports.create_book_storage = (isbn) => {
    const book_storage = `storage/books/${isbn}`;
    !fs.existsSync(book_storage) && fs.mkdirSync(book_storage);
}

// Create user storage
module.exports.create_user_storage = (username) => {
    const user_storage = `storage/users/${username}`;
    !fs.existsSync(user_storage) && fs.mkdirSync(user_storage);
}

// Delete book storage
module.exports.delete_book_storage = (isbn) => {
    const book_storage = `storage/books/${isbn}`;
    fs.existsSync(book_storage) && fs.rmdirSync(book_storage,{recursive: true});
}

// Delete user storage
module.exports.delete_user_storage = (username) => {
    const user_storage = `storage/users/${username}`;
    fs.existsSync(user_storage) && fs.rmdirSync(user_storage,{recursive: true});
}