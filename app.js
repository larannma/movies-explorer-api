require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { auth } = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');
const cookieParser = require('cookie-parser');
const { requestLogger, errorLogger } = require('./middlewares/logger');

const {
  createUser,
  login,
  logout
} = require('./controllers/users');

const corseAllowedOrigins = [
  'http://localhost:3000',
];

const {
  PORT = 3000,
  DB_URL = 'mongodb://127.0.0.1/bitfilmsdb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(cookieParser());

app.use(cors({
  origin: corseAllowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.static('public'));
app.use(express.json());
app.use(requestLogger);
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(20),
  }),
}), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(20),
  }),
}), createUser);

app.post('/signout', logout);

app.use(auth);

//routes
app.use('/users', userRouter);
app.use('/movies', movieRouter);

app.use(errorLogger);

app.use((err, req, res) => {
  const { statusCode = 500, message } = err;
  res
    .status(statusCode)
    .send({
      message: statusCode === 500
        ? 'На сервере произошла ошибка'
        : message,
    });
});

app.listen(PORT, () => {

});
