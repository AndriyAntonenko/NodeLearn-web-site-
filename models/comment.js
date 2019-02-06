const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const autopopulate = require('mongoose-autopopulate');

const schema = new Schema(
  {
    body: {
      type: String,
      require
    },
    post: {
      type: Schema.Types.ObjectId,
      ref: 'Post'
    },
    parent: {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    ownerName: {
      type: String,
    },
    ownerURL: {
      type: String
    },
    createdAt: {
      type: Date,
      default: Date.now()
    },
    children: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Comment',
        autopopulate: true
      }
    ]
  },
  {
    timestamps: false
  }
);

schema.plugin(autopopulate);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Comment', schema);
