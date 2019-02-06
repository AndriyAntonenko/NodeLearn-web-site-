const express = require('express');
const fs = require('fs');
const router = express.Router();
const moment = require('moment');
moment.locale('ru');

const config = require('../config');
const models = require('../models');

function posts(req, res) {
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;

  models.Post.find({
    status: 'publish'
  })
  .skip(perPage * page - perPage)
  .limit(perPage)
  .populate('owner')
  .sort({ createdAt: -1 })
  .then(posts => {
    models.Post.count({
      status: 'publish'
    }).then(count => {
      res.render('index', {
        home: req.session.url,
        user: {
          id: req.session.userId
        },
        posts,
        current: +page,
        pages: Math.ceil(count / perPage)
      });
    }).catch(() => {
      throw new Error('Ошибка сервера');
    });
  }).catch(() => {
    throw new Error('Ошибка сервера');
  });
}

// GET main page
router.get('/', (req, res) => posts(req, res));

// GET archive
router.get('/archive/:page', (req, res) => posts(req, res));

// GET post
router.get('/posts/:post', (req, res, next) => {
  const url = req.params.post.trim().replace(/ +(?= )/g, '');

  if(!url) {
    const err = new Error('Not Found');
    err.status = 404;
    next(err);
  } else {
    models.Post.findOne({
      url
    })
    .populate('owner')
    .then(post => {
      if(!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      } else {
        const readFile = fs.createReadStream(`${post.body}`, { encoding: 'utf-8' });
        let data = '';
        readFile.on('readable', () => {
          let chunk = readFile.read();
          if(chunk != null) data += chunk;
        });

        readFile.on('end', () => {
          models.Comment.find({
            post: post.id,
            parent: { $exists: false }
          })
          .sort({ createdAt: -1 })
          .then(comments => {
            res.render('post', {
              home: req.session.url,
              comments,
              moment,
              post,
              data
            });
          });
        });
      }
    });
  }
});

// GET user
router.get('/users/:user/:page*?', (req, res) => {
  const perPage = +config.PER_PAGE;
  const page = req.params.page || 1;
  const userURL = req.params.user;

  models.User.findOne({
    url: userURL
  }).then(user => {
    models.Post.find({
      owner: user.id,
      status: 'publish'
    }).skip(perPage * page - perPage)
    .limit(perPage)
    .sort({ createdAt: -1 })
    .populate('owner')
    .then(posts => {
      models.Post.count({
        owner: user.id
      }).then(count => {
        res.render('user', {
          home: req.session.url,
          authUser: req.session.userId,
          user,
          posts,
          current: page,
          pages: Math.ceil(count / perPage)
        });
      }).catch(() => {
        throw new Error('Ошибка сервера');
      });
    }).catch(() => {
      throw new Error('Ошибка сервера');
    });
  });
});

module.exports = router;
