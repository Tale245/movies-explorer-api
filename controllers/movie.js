const Movie = require('../models/movie');

const { STATUS__OK } = require('../constants/constants');

const NotFoundError = require('../Error/NotFoundError');
const ForbiddenError = require('../Error/ForbiddenError');
const BadRequestError = require('../Error/BadRequestError');

module.exports.getMovies = (req, res, next) => {
  Movie.find({})
    .then((data) => res.status(200).send(data))
    .catch((e) => {
      next(e);
    });
};

module.exports.createMovie = (req, res, next) => {
  const owner = req.user._id;

  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
  } = req.body;

  Movie.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    nameRU,
    nameEN,
    thumbnail,
    movieId,
    owner,
  })
    .then((data) => {
      res.status(STATUS__OK).send(data);
    })
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданые некорректные данные'));
      } else {
        next(e);
      }
    });
};

module.exports.deleteMovie = (req, res, next) => {
  Movie.findById(req.params.id)
    .populate('owner')
    .orFail(() => {
      throw new NotFoundError('Запрашиваемая карточка не найдена');
    })
    .then((data) => {
      if (data.owner.id !== req.user._id) {
        throw new ForbiddenError('Отказано в доступе');
      } else {
        Movie.findByIdAndRemove(data.id)
          .then(() => res.status(STATUS__OK).send(data))
          .catch((e) => {
            next(e);
          });
      }
    })
    .catch((e) => {
      if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};
