const mongoose = require('mongoose');
// const URLSlugs = require('mongoose-url-slugs');
const Schema = mongoose.Schema;

const schema = new Schema({
    title: {
      type: String
    },
    owner: {
      type: Schema.Types.ObjectId,
      ref: 'User'
    },
    description: {
      type: String
    },
    body: {
      type: String
    },
    url: {
      type: String
    },
    img: {
      type: String
    },
    status: {
      type: String,
      require: true
    }
  },
  {
    timestamps: true
  }
);

// schema.plugin(
//   URLSlugs('title', {
//     field: 'url',
//     update: true,
//     generator: text => tr.slugify(text)
//   })
// );

schema.set('toJSON', {
  virtuals: true
});

module.exports = mongoose.model('Post', schema);
