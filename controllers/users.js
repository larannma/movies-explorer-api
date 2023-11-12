const userModel = require('../models/user');
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

const {
  ConflictError,
  NotFoundError,
  NotAuthorizedError,
} = require('../errors/errors');


const SALT_ROUNDS = parseInt(process.env.SALT_ROUNDS, 10) || 10;
const JWT_SECRET = process.env.JWT_SECRET || 'supersecretstring';

const createUser = (req, res, next) => {
  const {
    email, password, name
  } = req.body;

  bcrypt.hash(password, SALT_ROUNDS, (err, hash) => {
    const userData = {
      email, password: hash, name
    };

    return userModel.create(userData)
      .then((r) => {
        console.log(r)
        const { passwordHashed, ...userWithoutPassword } = r.toObject();
        res.status(201).send(userWithoutPassword);
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
        httpOnly: false
      });

      return res.status(200).send({ token });
    });
  }).catch((err) => next(err));
};

const logout = (req, res, err) => {

}

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
  return userModel
    .findByIdAndUpdate(req.user._id, { email, name }, { new: true, runValidators: true })
    .then((r) => {
      if (r === null) {
        throw new NotFoundError('Пользователь не найден');
      }
      return res.status(200).send(r);
    })
    .catch((err) => next(err));
};

module.exports = {
  getCurrentUser,
  updateCurrentUser,
  createUser,
  login,
  logout
}
