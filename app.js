require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const helmet = require('helmet');
const { errors } = require('celebrate');
const cookieParser = require('cookie-parser');
const rateLimiter = require('./rateLimiter');
const { requestLogger, errorLogger } = require('./middlewares/logger');
const centralizedError = require('./errors/centralizedError');
const mainRouter = require('./routes/index');

const {
  NotFoundError,
} = require('./errors/errors');

const corseAllowedOrigins = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://movies.larannma.nomoredomainsmonster.ru',
  'https://movies.larannma.nomoredomainsmonster.ru',
];

const {
  PORT = 3001,
  DB_URL = 'mongodb://127.0.0.1/bitfilmsdb',
} = process.env;

mongoose.connect(DB_URL, {
  useNewUrlParser: true,
});

const app = express();
app.use(rateLimiter);
app.use(cookieParser());

app.use(cors({
  origin: corseAllowedOrigins,
  allowedHeaders: ['Content-Type', 'Authorization'],
  credentials: true,
}));

app.use(express.static('public'));
app.use(express.json());
app.use(requestLogger);
app.use(helmet());

// routes begin
app.use(mainRouter);
// routes end

app.use(errors());

app.use((req, res, next) => {
  next(new NotFoundError('Страница не найдена'));
});

app.use(errorLogger);
app.use(centralizedError);

app.listen(PORT, () => {

});
