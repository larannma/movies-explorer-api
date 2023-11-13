const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

const urlRegex = /^(https?:\/\/)?([\w.-]+)\.([a-z]{2,6})(\/[\w.-]*)*\/?$/;

const {
  getMovies,
  createMovie,
  deleteMovie,
} = require('../controllers/movies');

router.get('/', getMovies);

router.post('/', celebrate({
  body: Joi.object().keys({
    country: Joi.string().required(),
    director: Joi.string().required(),
    duration: Joi.number().required(),
    year: Joi.string().required(),
    description: Joi.string().required(),
    image: Joi.string().regex(urlRegex).required(),
    trailerLink: Joi.string().regex(urlRegex).required(),
    thumbnail: Joi.string().regex(urlRegex).required(),
    movieId: Joi.number().required(),
    nameEN: Joi.string().required(),
    nameRU: Joi.string().required(),
  }),
}), createMovie);

router.delete('/:movieId', celebrate({
  params: Joi.object().keys({
    movieId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
