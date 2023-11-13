const movieModel = require('../models/movie');

const {
  NotFoundError,
  ForbiddenError,
} = require('../errors/errors');

const getMovies = (req, res, next) => movieModel.find({ owner: req.user._id })
  .then((r) => res.status(200).send(r))
  .catch((err) => next(err));

const createMovie = (req, res, next) => {
  const owner = req.user._id;
  const {
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    movieId,
    nameRU,
    nameEN,
  } = req.body;
  return movieModel.create({
    country,
    director,
    duration,
    year,
    description,
    image,
    trailerLink,
    thumbnail,
    owner,
    movieId,
    nameRU,
    nameEN,
  })
    .then((r) => res.status(201).send(r))
    .catch((err) => next(err));
};

const deleteMovie = async (req, res, next) => {
  try {
    const { movieId } = req.params;

    const movie = await movieModel.findById(movieId);

    if (!movie) {
      next(new NotFoundError('Карточка пользователя не найдена'));
      return;
    }

    if (movie.owner.toString() !== req.user._id) {
      next(new ForbiddenError('Вы не можете удалять чужую карточку'));
      return;
    }

    await movieModel.findByIdAndDelete(movieId);
    return res.status(200).send(movie);
  } catch {
    next(new Error('Ошибка при удалении карточки пользователя'));
  }
};

module.exports = {
  getMovies,
  createMovie,
  deleteMovie,
};
