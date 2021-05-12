const express = require('express');
const userRouter = express.Router();

const b_crypt = require('bcrypt');
const jwt = require('jsonwebtoken');

let User = require('../../model/user');
const salt = b_crypt.genSaltSync(10);

userRouter.post('/register', (req, res) => {
  User.findOne({ where: { user_name: req.body.user_name }}).then(obj => {
    if (obj) {
      res.status(409).json( { message: "User with such name already exists" } );
    } else {
      User.create({
        user_name: req.body.user_name,
        user_pass: b_crypt.hashSync(req.body.user_pass, salt),
        user_email: req.body.user_email
      }).then(user => {
        res.status(201).json({regUser: user});
      });
    }
  });
});

userRouter.post('/login', (req, res) => {
  User.findOne({ where: { user_name: req.body.user_name }}).then(user => {
    if (user) {
      const passwordEven = b_crypt.compareSync(req.body.user_pass, user.user_pass);
      if (passwordEven) {
        const token = jwt.sign({
          name: user.user_name,
          email: user.user_email
        }, process.env.SECRET_KEY, {expiresIn: 60 * 60});

        console.log("send cookie");

        const loggedUser = {};
        loggedUser.user_id = user.user_id;
        loggedUser.user_name = user.user_name;
        loggedUser.user_email = user.user_email;

        res.status(200).
          cookie('token', token, { HttpOnly: true, secure: false, /* maxAge: 60 * 60 * 60 */ }).
          json({ logUser: loggedUser });
      } else {
        res.status(401).json( { message: "Incorrect password" } );
      }
    } else {
      res.status(404).json( { message: "User with such name not found"} );
    }
  });
});

//get all users
userRouter.post('/users', (req, res) => {
  User.findAll().then(users => {
      if (users) {
          res.status(201).json({users: users});
      } else {
          res.status(409).json( { message: "No words found for such user" } );
      }
  });
});

module.exports = userRouter;