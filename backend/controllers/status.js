const Status = require('../models/status');

module.exports.exists = async (status_id) => {
    let val = await Status
        .countDocuments({ status_id: status_id })
        .exec()
    return val > 0;
}