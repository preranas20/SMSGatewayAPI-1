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

exports.SendToDevice= function(req,res){
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


