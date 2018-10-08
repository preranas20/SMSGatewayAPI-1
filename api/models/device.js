const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    UID: {
        type:Number
    },
    phone_id: {
            type:Number
        }
});

module.exports = mongoose.model('Device', deviceSchema);