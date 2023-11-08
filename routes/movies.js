const router = require('express').Router();
const { celebrate, Joi } = require('celebrate');

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
    image: Joi.string().uri().required(),
    trailerLink: Joi.string().uri().required(),
    thumbnail: Joi.string().uri().required(),
    owner: Joi.string().hex().length(24).required(),
    movieId: Joi.number().required(),
    movieEN: Joi.string().required(),
    movieRU: Joi.string().required(),
  }),
}),createMovie);

router.delete('/:movieId', celebrate({
  body: Joi.object().keys({
    moviedId: Joi.string().hex().length(24).required(),
  }),
}), deleteMovie);

module.exports = router;
