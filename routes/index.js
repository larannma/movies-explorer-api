const router = require('express').Router();

const { celebrate, Joi } = require('celebrate');
const userRouter = require('./users');
const movieRouter = require('./movies');
const { auth } = require('../middlewares/auth');

const {
  createUser,
  login,
  logout,
} = require('../controllers/users');

router.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
  }),
}), login);
router.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email(),
    password: Joi.string().required().min(8),
    name: Joi.string().required().min(2).max(20),
  }),
}), createUser);
router.post('/signout', logout);
router.use(auth);
router.use('/users', userRouter);
router.use('/movies', movieRouter);

module.exports = router;
