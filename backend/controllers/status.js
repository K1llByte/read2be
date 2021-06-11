const Status = require('../models/status');


module.exports.list_all = async () => {
    return Status
        .find({},{ "_id":0 })
        .exec()
}


// Check if a status exists
module.exports.exists = async (status_id) => {
    let val = await Status
        .countDocuments({ status_id: status_id })
        .exec()
    return val > 0;
}