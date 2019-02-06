const mongoose = require('mongoose');
const URLSlugs = require('mongoose-url-slugs');
const tr = require('transliter');
const Schema = mongoose.Schema;

const schema = new Schema(
  {
    firstName: {
      type: String,
      required: true
    },
    lastName: {
      type: String,
      required: true
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    password: {
      type: String,
      required: true,
      unique: true
    },
    img: {
      type: String,
    }
  },
  {
    timestamps: true
  }
);

schema.plugin(
  URLSlugs('firstName', {
    field: 'url',
    generator: text => tr.slugify(text)
  })
);

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('User', schema);
