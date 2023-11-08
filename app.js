require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRouter = require('./routes/users');
const movieRouter = require('./routes/movies');
const { auth } = require('./middlewares/auth');
const { celebrate, Joi } = require('celebrate');

const {
  createUser,
  login,
} = require('./controllers/users');

const corseAllowedOrigins = [
  'http://localhost:3000',
];

const {
  PORT = 3000,
  DB_URL = 'mongodb://localhost:27017/bitfilmsdb',
} = process.env;

console.log(DB_URL)

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();

app.use(cors({
  origin: corseAllowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.static('public'));
app.use(express.json());

// app.post('/signin', celebrate({
//   body: Joi.object().keys({
//     email: Joi.string().required().email(),
//     password: Joi.string().required().min(8),
//   }),
// }), login);

app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(8).max(20),
  }),
}), createUser);

// app.use(auth);

//routes
app.use('/users', userRouter);
app.use('/movies', movieRouter);

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
