const express = require('express');
const router = express.Router();
const path = require('path');
const Sharp = require('sharp');
const multer = require('multer');
const mkdirp = require('mkdirp');
const fsExtra = require('fs-extra');

const config = require('../config');
const diskStorage = require('../utils/diskStorage');
const rs = () => Math.random().toString(36).slice(-3);
const models = require('../models');

const storage = diskStorage({
  destination: (req, file, callback) => {
    const dir = `/${rs()}/${rs()}`;
    req.dir = dir; // для того, что-бы обратиться в filename
    mkdirp(config.DESTINATION + dir, err =>
       callback(err, config.DESTINATION + dir)
    );
    // callback(null, config.DESTINATION + dir);
  },
  filename: (req, file, callback) => {
    const fileName = Date.now().toString(36) + path.extname(file.originalname);
    const dir = req.dir;

    if(~req.url.indexOf('avatar')) {
      models.UserImg.deleteMany({
        owner: req.body.userId
      }).then(() => {
        models.User.findById(req.body.userId).then(user => {
          if(!user) {
            const err = new Error('No user');
            err.code = 'NOUSER';
            return callback(err);
          }

          if(user.img) {
            fsExtra.remove(`public/images${user.img.slice(0, 4)}`, err => {
              console.log(err);
            });
          }

          models.UserImg.create({
            owner: user.id,
            path: dir + '/' + fileName
          }).then(upload => {
            user.img = upload.path;
            user.save();
          }).catch(err => {
            throw err;
          });
        });
      }).catch(err => console.log(err));


    } else {
      console.log(req.body.postId);
      models.PostImg.deleteMany({
        owner: req.body.postId
      }).then(() => {
        // find post
        models.Post.findById(req.body.postId).then(post => {
          if(!post) {
            const err = new Error('No post');
            err.code = 'NOPOST';
            return callback(err);
          }

          if(post.img) {
            fsExtra.remove(`public/images${post.img.slice(0, 4)}`, err => {
              throw err;
            });
          }

          // upload
          models.PostImg.create({
            owner: post.id,
            path: dir + '/' + fileName
          }).then(upload => {
            post.img = upload.path;
            post.save();
          });

        }).catch(err => {
          throw err;
        });
      }).catch(err => { throw err; });


    }
    req.filePath = dir + '/' + fileName;

    callback(null, fileName);
  },
  sharp: (req, file, callback) => {
    const resizer = Sharp()
      .resize(1024, 768)
      .max()
      .withoutEnlargement()
      .toFormat('jpg')
      .jpeg({
        quality: 40,
        progressive: true
      });
      callback(null, resizer);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 2 * 1024 * 1024 },
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if(ext !== '.jpg' && ext !== '.jpeg' && ext !== '.png') {
      const err = new Error('Extention');
      err.code = 'EXTENTION';
      return callback(err);
    }
    callback(null, true);
  }
}).single('file');

// POST add image
router.post('/image', (req, res) => {
  upload(req, res, err => {
    let error = '';
    if(err) {
      if(err.code === 'LIMIT_FILE_SIZE') {
        error = 'Картинка не более 2mb';
      }
      if(err.code === 'EXTENTION') {
        error = 'Только JPEG, JPG или PNG';
      }
      if(err.code === 'NOPOST') {
        error = 'Обнови страницу';
      }
    }

    res.json({
      ok: !error,
      error,
      filePath: req.filePath
    })
  });
});

router.post('/avatar', (req, res) => {
  upload(req, res, err => {
    let error = '';
    if(err) {
      if(err.code === 'LIMIT_FILE_SIZE') {
        error = 'Картинка не более 2mb';
      }
      if(err.code === 'EXTENTION') {
        error = 'Только JPEG, JPG или PNG';
      }
      if(err.code === 'NOPOST') {
        error = 'Обнови страницу';
      }
    }

    res.json({
      ok: !error,
      error,
      filePath: req.filePath
    })
  });
});

module.exports = router;
