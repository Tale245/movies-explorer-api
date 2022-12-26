const { celebrate, Joi } = require('celebrate');
const router = require('express').Router();

const { getMovies, createMovie, deleteMovie } = require('../controllers/movie');

const { urlRegExp } = require('../constants/constants');

router.get('/movies', getMovies);

router.post('/movies', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().pattern(urlRegExp).required(),
    trailerLink: Joi.string().pattern(urlRegExp).required(),
    thumbnail: Joi.string().pattern(urlRegExp).required(),
    movieId: Joi.string().required().hex(),
    nameRU: Joi.string().required(),
    nameEN: Joi.string().required(),
  }),
}), createMovie);

router.delete('/movies/:_id', celebrate({
  params: Joi.object().keys({
    _id: Joi.string().length(24).hex(),
  }),
}), deleteMovie);

module.exports = router;
