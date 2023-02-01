const bcrypt = require('bcryptjs');
const {
  STATUS__OK,
} = require('../constants/constants');

const NotFoundError = require('../Error/NotFoundError');
const BadRequestError = require('../Error/BadRequestError');
const SignupError = require('../Error/SignupError');

const User = require('../models/user');

module.exports.getUserInfo = (req, res, next) => {
  User.findById(req.user._id)
    .orFail(() => {
      throw new NotFoundError('Передан невалидный id пользователя');
    })
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((err) => {
      if (err.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(err);
      }
    });
};

module.exports.createUser = (req, res, next) => {
  const {
    name, email, password,
  } = req.body;

  bcrypt.hash(password, 10)
    .then((hash) => {
      User.create({
        name, email, password: hash,
      })
        .then((data) => {
          res.status(STATUS__OK).send({
            name: data.name, email: data.email,
          });
        })
        .catch((e) => {
          if (e.name === 'ValidationError') {
            next(new BadRequestError('Переданы некорректные данные'));
          } else if (e.code === 11000) {
            next(new SignupError('Email адрес занят, используйте другой, либо войдите в аккаунт'));
          } else {
            next(e);
          }
        });
    }).catch((e) => {
      next(e);
    });
};

module.exports.updateUserInfo = (req, res, next) => {
  const { name, email } = req.body;

  User.findByIdAndUpdate(
    req.user._id,
    { name, email },
    {
      new: true,
      runValidators: true,
    },
  )
    .then((data) => res.status(STATUS__OK).send(data))
    .catch((e) => {
      if (e.name === 'ValidationError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else if (e.name === 'CastError') {
        next(new BadRequestError('Переданы некорректные данные'));
      } else {
        next(e);
      }
    });
};
