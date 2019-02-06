const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt-nodejs');

const models = require('../models');

// Registration
router.post('/registration', (req, res) => {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;
  const password = req.body.password;

  models.User.findOne({
    email
  }).then(user => {
    if(!user) {
      bcrypt.hash(password, null, null, (err, hash) => {
        models.User.create({
          firstName,
          lastName,
          email,
          password: hash
        }).then(user => {
          req.session.userId = user._id;
          req.session.userEmail = user.email;
          req.session.url = user.url;
          req.session.firstName = user.firstName;
          req.session.lastName = user.lastName;
          res.json({
            ok: true
          });
        })
        .catch(err => {
          console.log(err);
          res.json({
            ok: false,
            error: 'Ошибка, попробуйте позже'
          });
        });
      });
    } else {
      res.json({
        ok: false,
        error: 'Email занят',
        field: 'email'
      })
    }
  })
});

// Authorization
router.post('/authorization', (req, res) => {
  const email = req.body.email;
  const password = req.body.password;

  models.User.findOne({
    email
  }).then(user => {
    if(!user) {
      res.json({
        ok: false,
        error: 'Email введён не правильно',
        field: 'email'
      });
    } else {
      bcrypt.compare(password, user.password, (err, result) => {
        if(!result) {
          res.json({
            ok: false,
            error: 'Пароль введён не правильно',
            field: 'password'
          });
        } else {
          req.session.userId = user.id;
          req.session.userEmail = user.email;
          req.session.url = user.url;
          req.session.firstName = user.firstName;
          req.session.lastName = user.lastName;
          res.json({
            ok: true
          });
        }
      });
    }
  })
  .catch(() => {
    res.json({
      ok: false,
      error: 'Ошибка, попробуйте позже'
    });
  });
});

// GET for logout
router.get('/logout', (req, res) => {
  if(req.session) {
    req.session.destroy(()=> {
      res.redirect('/authorization');
    })
  } else {
    req.redirect('/');
  }
});

module.exports = router;
