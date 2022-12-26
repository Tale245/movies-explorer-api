require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const cors = require('cors');
const userRouter = require('./routes/user');
const moviesRouter = require('./routes/movie');
const { login } = require('./controllers/login');
const { createUser } = require('./controllers/user');
const { INTERNAL__SERVER_ERROR } = require('./constants/constants');
const NotFoundError = require('./Error/NotFoundError');
const auth = require('./middlewares/auth');
const { requestLogger, errorLogger } = require('./middlewares/Logger');

const app = express();
mongoose.connect('mongodb://127.0.0.1/bitfilmsdb');

const options = {
  origin: [
    'http://localhost:3000',
    'https://project-movies-479.nomoredomains.club',
    'http://project-movies-479.nomoredomains.club',
    'https://tale245.github.io',
  ],
  methods: ['GET', 'HEAD', 'PUT', 'PATCH', 'POST', 'DELETE'],
  preflightContinue: false,
  optionsSuccessStatus: 204,
  allowedHeaders: ['Content-Type', 'origin', 'Authorization'],
  credentials: true,
};

app.use('*', cors(options));

app.use(bodyParser.json());

app.use(requestLogger);

app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    name: Joi.string().required().min(2).max(30),
    email: Joi.string().required().email(),
    password: Joi.string().required(),
  }),
}), createUser);

app.use(auth);

app.use('/', userRouter);
app.use('/', moviesRouter);

app.use((req, res, next) => {
  next(new NotFoundError('Страница по указанному маршруту не найдена'));
});

app.use(errorLogger);

app.use(errors());

app.use((err, req, res, next) => {
  const { statusCode = INTERNAL__SERVER_ERROR, message } = err;

  res.status(statusCode).send({
    // проверяем статус и выставляем сообщение в зависимости от него
    message: statusCode === INTERNAL__SERVER_ERROR ? 'На сервере произошла ошибка' : message,
  });
  next();
});

const { PORT = 3000 } = process.env;

app.listen(PORT, () => {
  console.log(`Server has been started on port ${PORT}`);
});
