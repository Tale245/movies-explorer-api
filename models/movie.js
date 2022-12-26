const mongoose = require('mongoose');

const { urlRegExp } = require('../constants/constants');

const movieSchema = new mongoose.Schema(
  {
    country: {
      type: String,
      required: true,
    },
    director: {
      type: String,
      required: true,
    },
    duration: {
      type: Number,
      require: true,
    },
    year: {
      type: String,
      require: true,
    },
    description: {
      type: String,
      require: true,
    },
    image: {
      type: String,
      require: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    trailerLink: {
      type: String,
      require: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    thumbnail: {
      type: String,
      require: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
      ref: 'user',
    },
    movieId: {
      type: mongoose.Schema.Types.ObjectId,
      require: true,
    },
    nameRU: {
      type: String,
      require: true,
    },
    nameEN: {
      type: String,
      require: true,
    },

  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
