const mongoose = require("mongoose");

const User = require("../models/user");
const Device=require("../models/device");
const Message=require("../models/message");
// fcm server 
var admin = require('firebase-admin');
var serviceAccount = require('../AccountKey/smsgateway-5d944-firebase-adminsdk-zbyn3-0ffa63630d.json');

module.exports.SendToDevice= function(req, res){
  //console.log(req.body);

  var phoneNumer=req.body.phone;
  var messageText=req.body.messageText;
  var toPhoneNumber=req.body.toPhoneNumber;
 if(! admin.apps.length)
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount),
    databaseURL: "https://smsgateway-5d944.firebaseio.com"
  });
 // console.log(phone);
  getDevice(phoneNumer,function(data){
//this registration token is deviceID from the Device model

      var registrationToken =  data.deviceId;
      console.log('sending sms...');
// See documentation on defining a message payload.
      var message = {
        notification: {
          title: toPhoneNumber,
          body: messageText
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


