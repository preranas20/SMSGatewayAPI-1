const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const User = require("../models/user");
const Device=require("../models/device");
const Message=require("../models/message");
// fcm server 
var admin = require('firebase-admin');
var serviceAccount = require('../AccountKey/smsgateway-5d944-firebase-adminsdk-zbyn3-0ffa63630d.json');

module.exports.SendToDevice= function(req,res){
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smsgateway-5d944.firebaseio.com"
  });
  console.log('sending sms...');
  //this registration token is deviceID from the Device model
  var registrationToken = 'fT_l2Y7Mt4M:APA91bF7v7EhUQlGvVFITPPzgmsOyOkKKlRBAF9LQwAMteT09XMDd8rC5QnoHHKBz7p7U-X3V6ZszLqcCsAYdqUwx7zmYgKHsRkKHwskZguDsalsXZOFQtK_Uo0Y3QtGmIMchAKcE0IY';

  // See documentation on defining a message payload.
  var message = {
    notification: {
      title: '$GOOG up 1.43% on the day',
      body: '$GOOG gained 11.80 points to close at 835.67, up 1.43% on the day.'
    },
    token: registrationToken
  };
  
  
  // Send a message to the device corresponding to the provided
  // registration token.
  admin.messaging().send(message)
    .then((response) => {
      // Response is a message ID string.
      console.log('Successfully sent message:', response);
      res.status(201).json({
      
        message: "Successfully sent message",
        status: 200
      });
    })
    .catch((error) => {
      console.log('Error sending message:', error);
      res.status(500).json({
        message: err,
        status: 500
      });
    });
};

exports.getDeviceId = function (req,res) {
  
};


var ReceiveToGateway = function(req, next){
 console.log('getting useridfor this phone number.')
  Device
  .find({deviceId:req.deviceId})
  .exec(function(err,device){
      console.log(device[0]);
       next(device[0]);
  });
};

var getDevice = function (req,next) {
  console.log('getting device for this phone number.')
  var phoneNumber= req;
  console.log(phoneNumber);
  Device
  .find({ phone: phoneNumber })
  .exec(function(err, device) {
    console.log(device);
   next(device[0]);
  });
};

    
module.exports.receivedMessage = function(req,res){
  deviceId=req.body.deviceId;
  console.log("Inside receivedMessage");
  ReceiveToGateway(deviceId,function(data){
  

  User.find({_id:data.user_id})
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "User Not Found",
          status: 401
        });
      }
     if (err) {
          return res.status(401).json({
            message: "Request Failed",
            status: 401
          });
        }
        else {
          const message = new Message({
              message: req.body.message,
              date: new Date().toString().replace(/T/, ':').replace(/\.\w*/, ''),
              from: req.body.from,
              to: req.body.deviceId,
              status:"Upstream",
              user_id:data.user_id
             // phone:req.body.phone
            });
            message
              .save()
              .then(result => {
                console.log(user);
                res.status(201).json({
                  data:{callback_webhook:user[0].callback_webhook},
                  message: "Message Received",
                  status: 200
                });
              })
         
        }
        res.status(401).json({
          message: "Request failed",
          status: 401
        });
      
    })
    .catch(err => {
      console.log(err);
      res.status(500).json({
        error: err,
        status: 500
      });
    });
    });


};


