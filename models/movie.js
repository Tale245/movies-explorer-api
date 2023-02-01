const mongoose = require('mongoose');

const { urlRegExp } = require('../constants/constants');

const objectId = mongoose.Schema.Types.ObjectId;

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
      required: true,
    },
    year: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    image: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    trailerLink: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    thumbnail: {
      type: String,
      required: true,
      validate: {
        validator(v) {
          return urlRegExp.test(v);
        },
      },
    },
    owner: {
      type: objectId,
      required: true,
      ref: 'user',
    },
    movieId: {
      type: Number,
      required: true,
    },
    nameRU: {
      type: String,
      required: true,
    },
    nameEN: {
      type: String,
      required: true,
    },

  },
  {
    versionKey: false,
  },
);

module.exports = mongoose.model('movie', movieSchema);
