const express = require('express');
const router = express.Router();

const models = require('../models');

// POST comment
router.post('/add', async (req, res) => {
  const userId = req.session.userId;
  const email = req.session.userEmail;
  const firstName = req.session.firstName;
  const lastName = req.session.lastName;
  const url = req.session.url;
  let id;

  if(!userId || !email) {
    res.json({
      ok: false
    });
  } else {
    const post = req.body.post;
    const body = req.body.body;
    const parent = req.body.parent;

    try {
      if(!parent) {
        const commentWithoutParent = await models.Comment.create({
          post,
          body,
          owner: userId,
          ownerName: firstName + ' ' + lastName,
          ownerURL: url
        });
        id = commentWithoutParent.id;
      } else {
        const parentComment = await models.Comment.findById(parent);
        if(!parentComment) {
          res.json({
            ok: true,
            body: body,
            name: req.session.firstName + ' ' + req.session.lastName,
            url: req.session.url,
            id
          });
        } else {
          const comment = await models.Comment.create({
            post,
            body,
            parent,
            owner: userId,
            ownerName: firstName + ' ' + lastName,
            ownerURL: url
          });

          id = comment.id;
          const children = parentComment.children;
          children.push(comment.id);
          parentComment.children = children;
          await parentComment.save();
        }
      }
    } catch (e) {
      res.json({
        ok: false
      });
    }
    res.json({
      ok: true,
      body: body,
      name: req.session.firstName + ' ' + req.session.lastName,
      url: req.session.url,
      id
    });
  }
});

module.exports = router;
