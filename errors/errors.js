class NotFoundError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 404;
  }
}

class NotAuthorizedError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 401;
  }
}

class ForbiddenError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 403;
  }
}

class BadRequestError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 400;
  }
}

class ConflictError extends Error {
  constructor(message) {
    super(message);
    this.statusCode = 409;
  }
}

module.exports = {
  NotFoundError,
  NotAuthorizedError,
  BadRequestError,
  ConflictError,
  ForbiddenError,
};
