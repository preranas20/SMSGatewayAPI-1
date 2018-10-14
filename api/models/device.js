const mongoose = require('mongoose');

const deviceSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    APIKey: {
        type:String
    },
    phone:{
    	type:String
    },
    callback_webhook: {
            type:String
     }
});

module.exports = mongoose.model('Device', deviceSchema);