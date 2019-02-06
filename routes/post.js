const express = require('express');
const fs = require('fs');
const router = express.Router();
const tr = require('transliter');

const models = require('../models');

// GET edit
router.get('/edit/:id', async (req, res, next) => {
  const id = req.params.id.trim().replace(/ +(?= )/g, '');

  if(!req.session.userId) {
    res.redirect('/');
  } else {
    try {
      const post = await models.Post.findById(id);

      if(!post) {
        const err = new Error('Not Found');
        err.status = 404;
        next(err);
      }

      if(post.body) {
        const readFile = fs.createReadStream(`${post.body}`, { encoding: 'utf-8' });
        let data = '';
        readFile.on('readable', () => {
          const chunk = readFile.read();
          if(chunk != null) data += chunk;
        });

        readFile.on('end', () => {
          res.render('add', {
            home: req.session.url,
            post,
            data
          });
        });
      } else {
        res.render('add', {
          home: req.session.url,
          post
        });
      }

    } catch (e) {
      console.log(e);
    }
  }
});

// GET add
router.get('/add', (req, res) => {
  const id = req.session.userId;
  const email = req.session.userEmail;
  console.log(id, email);

  if(!id || !email) {
    res.redirect('/authorization');
  } else {
    models.Post.findOne({
      owner: id,
      status: 'draft'
    }).then(post => {
      if(!post) {
        models.Post.create({
          owner: id,
          status: 'draft',
          url: `draft-${Date.now().toString(36)}`
        }).then(post => {
          res.redirect(`/post/edit/${post.id}`);
        }).catch(e => console.log(e));
      } else {
        res.redirect(`/post/edit/${post.id}`);
      }
    }).catch(e => console.log(e));
  }
});

// POST add
router.post('/add', (req, res, next) => {
  const id = req.session.userId;
  const email = req.session.userEmail;
  const url = `${tr.slugify(req.body.title.trim().replace(/ +(?= )/g, ''))}-${Date.now().toString(36)}`;

  if(!id || !email) {
    res.redirect('/authorization');
  } else {

    const file = fs.createWriteStream(`articles/${url.toString(36)}.txt`);
    file.write(req.body.body.trim());

    if(!req.body.id) {
      models.Post.create({
        title: req.body.title.trim().replace(/ +(?= )/g, ''),
        url,
        owner: id,
        description: req.body.description,
        body: `articles/${url.toString(36)}.txt`,
        status: 'publish'
      }).then(() => {
        res.json({
          ok: true
        });
      }).catch(() => {
        res.json({
          ok: false
        });
      });
    } else {
      models.Post.findOneAndUpdate({
        _id: req.body.id
      },
      {
        url,
        title: req.body.title.trim().replace(/ +(?= )/g, ''),
        description: req.body.description,
        body: `articles/${url.toString(36)}.txt`,
        status: 'publish'
      },
      { new: false })
      .then(post => {
        if(post.body) {
          fs.stat(`${post.body}`, (err) => {
            if(err) {
              const err = new Error('Ошибка сервера');
              err.status = 500;
              next(err);
            }

            fs.unlink(`${post.body}`, (err) => {
              if(err) {
                const err = new Error('Ошибка сервера');
                err.status = 500;
                next(err);
              }
            });
          });
        }
        console.log(post);
        res.json({
          ok: true
        });
      }).catch(() => {
        res.json({
          ok: false
        });
      });
    }
  }
});

module.exports = router;
