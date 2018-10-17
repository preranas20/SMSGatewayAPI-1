var mongoose = require('mongoose');
const User = require("../models/user");
const Message = require("../models/message");
const Device = require("../models/device");
const jwt = require("jsonwebtoken");

//show developer details
module.exports.showDeveloperDetails = function(req, res){
  const id=req.userData.userId;
  if (!id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    User
      .findById(id)
      .exec(function(err, user) {
        res.status(200).json(
        user
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};

//show developers to Admin
module.exports.showDevelopers = function(req, res){
  const role=req.userData.role;
  if (!(role=="admin")) {
    res.status(401).json({
      "message" : "UnauthorizedError: not an admin profile"
    });
  } else {
    User
      .find({ role: 'developer' })
      .exec(function(err, user) {
        res.status(200).json(
        user
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};




//show devices for a developer
module.exports.showDevices = function(req, res){
  const id=req.userData.userId;
  if (!id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Device
      .find({APIKey: req.body.APIKey })
      .exec(function(err, device) {
        res.status(200).json(
        device
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};



//To test
module.exports.addMessage = function(req, res){
const message = new Message({
              _id: new mongoose.Types.ObjectId(),
              deviceId: req.body.deviceId,
              message: req.body.message,
              date: req.body.date,
              from: req.body.from,
              to: req.body.to,
              status: req.body.status
            });
message.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "message added",
                  status: 200
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  status: 500
                });
              }); }

//show message log details for device
module.exports.showLogs = function(req, res){
  const id=req.userData.userId;
  if (!id) {
    res.status(401).json({
      "message" : "UnauthorizedError: private profile"
    });
  } else {
    Message
      .find({deviceId: req.body.deviceId })
      .exec(function(err, message) {
        res.status(200).json(
        message
       // {message:"Request successful",
        //user:user,
        //status:200}
        )
      });
  }
};

module.exports.addDevice = function(req, res){
var userId=req.userData.userId;
  const device = new Device({
              _id: new mongoose.Types.ObjectId(),
              deviceId: req.body.deviceId,
              phone: req.body.phone,
              user_id: userId
            });
        device.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "device added",
                  status: 200
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  status: 500
                });
              });
  };


module.exports.receivedMessage = function(req, res){
  Device.find({phone:req.body.to},function(err,device){
    if(err){
      res.status(401).json({
      "message" : "Request Unsuccessful"
     });  
    }else{
       if(device[0].APIKey==req.body.APIKey){
         return res.status(200).json({
            message: "Request successful",
            status: 200
          });
         var obj = {
          callback_webhook:device[0].callback_webhook,
          to:req.body.to,
          from:req.body.from,
          message:req.body.message,
          APIKey:req.body.APIKey
         };
         receivedForDeveloper(obj,response);
       }

    }
  });
};
    
module.exports.receivedForDeveloper = function(req,res){
  const url=req.body.callback_webhook;
  User.find({callback_webhook:url},function(err,user){
      if(err){
        res.status(401).json({
          "message" : "Request Unsuccessful"
       });  
      }else{
        if(user[0].APIKey==req.body.APIKey){
         const message = new Message({
              _id: new mongoose.Types.ObjectId(),
              message: req.body.message,
              date: Date.now(),
              from: req.body.from,
              to: req.body.to,
              status: "Received"
            });           
         message.save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  message: "Message created",
                  status: 200
                });
              })
              .catch(err => {
                console.log(err);
                res.status(500).json({
                  error: err,
                  status: 500
                });
              });
        }
      }
  });
      

};
  



module.exports.editProfile = function(req,res){
  const id=req.userData.userId;
  User.findByIdAndUpdate(
    id,
    {
      $set:{
        email: req.body.email,
        password: hash,
        role: req.body.role,
        APIKey: req.body.APIKey,
        callback_webhook:req.body.callback_webhook
      }
    },
    {new: true},
    function(err,result){
    if(err){
      console.log(err);
      res.status(500).json({
        error:err,
        status:500
      });
    }else{
      console.log(result);
      res.status(200).json(
    //  message:"Request successful",
      result
      //status:200
      );
     // console.log(result);
    }
    });

};
