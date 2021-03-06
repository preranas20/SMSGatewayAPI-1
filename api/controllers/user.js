const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const APIKey = require("apikeygen");

const User = require("../models/user");


exports.user_signup = (req, res, next) => {
  User.find({ email: req.body.email }) //check if email id exists before in DB
    .exec()
    .then(user => {
      if (user.length >= 1) {
        return res.status(409).json({
          message: "Email address exists",
          status: 409
        });
      } else {
        bcrypt.hash(req.body.password, 10, (err, hash) => { //hashing and salting password
          if (err) {
            return res.status(500).json({
              error: err,
              status: 500
            });
          } else {
            const user = new User({
              _id: new mongoose.Types.ObjectId(),
              email: req.body.email,
              password: hash,
             role: req.body.role?req.body.role:'developer',
              APIKey: APIKey.apikey(),
              callback_webhook:req.body.callback_webhook
             // phone:req.body.phone
            });
            user
              .save()
              .then(result => {
                console.log(result);
                res.status(201).json({
                  data:{ apiKey:result.APIKey},
                  message: "User created",
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
        });
      }
    });
};

exports.user_login = (req, res, next) => {
  User.find({ email: req.body.email })
    .exec()
    .then(user => {
      if (user.length < 1) {
        return res.status(401).json({
          message: "Auth failed",
          status: 401
        });
      }
      bcrypt.compare(req.body.password, user[0].password, (err, result) => {
        if (err) {
          return res.status(401).json({
            message: "Auth failed",
            status: 401
          });
        }
        if (result) {
          const token = jwt.sign(
            { //payload
              //email: user[0].email,
              role: user[0].role,
              userId: user[0]._id
            },
            process.env.JWT_KEY, //private key
            {
              expiresIn: "1h"
            }
          );
          return res.status(200).json({
            message: "Auth successful",
            token: token,
            role:user[0].role,
           // userId:user[0]._id,
            status: 200
          });
        }
        res.status(401).json({
          message: "Auth failed",
          status: 401
        });
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

exports.user_delete = (req, res, next) => {
  User.remove({ _id: req.params.userId })
    .exec()
    .then(result => {
      res.status(200).json({
        message: "User deleted",
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
