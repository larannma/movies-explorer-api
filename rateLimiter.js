const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: 'Слишко много запросов с этого IP, попробуйте позже.',
});

module.exports = limiter;
