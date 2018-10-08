const mongoose = require('mongoose');

const messageSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    deviceId: {
        	type: Number
            },
    message: {
        type:String
    },
    date: {
            type : Date, default: Date.now
        },
    from: { type: Number, required: true },
    to: {
    	type: Number,
        required: true},
    status:{
       type:String
     }
});

module.exports = mongoose.model('Message', messageSchema);