const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const userModel = require('../models/user');

const {
  ConflictError,
  NotFoundError,
  NotAuthorizedError,
} = require('../errors/errors');

const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretstring';

const createUser = (req, res, next) => {
  const {
    email, password, name,
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    const userData = {
      email, password: hash, name,
    };

    return userModel.create(userData)
      .then(() => {
        res.status(201).send({ message: 'Пользователь успешно зарегестрирован' });
      })
      .catch((error) => {
        if (error.code === 11000) {
          next(new ConflictError('Пользователь с таким email уже существует'));
          return;
        }
        next(error);
      });
  });
};

const login = (req, res, next) => {
  const { email, password } = req.body;
  return userModel.findOne({ email }).select('+password').then((user) => {
    if (!user) {
      next(new NotAuthorizedError('Такого пользователя не существует'));
      return;
    }
    bcrypt.compare(password, user.password, (err, isValid) => {
      if (!isValid) {
        next(new NotAuthorizedError('Пароль неверный'));
        return;
      }

      const token = jwt.sign({
        _id: user._id,
      }, JWT_SECRET, { expiresIn: '1w' });

      res.cookie('token', token, {
        maxAge: 3600000 * 24 * 7,
        httpOnly: true,
        secure: true,
        sameSite: true,
      });

      return res.status(200).send({ token });
    });
  }).catch((err) => next(err));
};

const logout = (req, res, next) => {
  try {
    res.clearCookie('token');
    return res.status(200).send({ message: 'Куки очищены' });
  } catch (error) {
    next(error);
  }
};
const getCurrentUser = (req, res, next) => {
  const userId = req.user._id;
  return userModel.findById(userId)
    .then((result) => {
      if (result === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(result);
    })
    .catch((err) => next(err));
};

const updateCurrentUser = (req, res, next) => {
  const { email, name } = req.body;

  userModel.findOne({ email })
    .then((existingUser) => {
      if (existingUser && existingUser._id.toString() !== req.user._id.toString()) {
        throw new ConflictError('Пользователь с таким адресом электронной почты уже существует');
      }

      return userModel
        .findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true });
    })
    .then((updatedUser) => {
      if (updatedUser === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(updatedUser);
    })
    .catch((err) => next(err));
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
  logout,
};
