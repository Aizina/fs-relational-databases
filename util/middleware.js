
const jwt = require('jsonwebtoken')

const {
  ValidationError,
  UniqueConstraintError,
  ForeignKeyConstraintError
} = require('sequelize')

const { SECRET } = require('./config')
const { User, Session } = require('../models')

const httpError = (status, message) => {
  const error = new Error(message)
  error.status = status
  return error
}

const asyncHandler = (handler) => {
  return (req, res, next) => {
    Promise.resolve()
      .then(() => handler(req, res, next))
      .catch(next)
  }
}

const tokenExtractor = asyncHandler(async (req, res, next) => {
  const authorization = req.get('authorization')

  if (
    !authorization ||
    !authorization.toLowerCase().startsWith('bearer ')
  ) {
    throw httpError(401, 'token missing')
  }

  const token = authorization.substring(7).trim()

  const decodedToken = jwt.verify(token, SECRET, {
    algorithms: ['HS256']
  })

  if (!decodedToken.id) {
    throw httpError(401, 'token invalid')
  }

  const session = await Session.findOne({
    where: {
      token,
      userId: decodedToken.id
    }
  })

  if (!session) {
    throw httpError(401, 'session expired or invalid')
  }

  const user = await User.findByPk(decodedToken.id)

  if (!user) {
    throw httpError(401, 'invalid user')
  }

  if (user.disabled) {
    throw httpError(401, 'user account is disabled')
  }

  req.user = user
  req.token = token
  req.session = session

  next()
})

const unknownEndpoint = (req, res) => {
  res.status(404).json({
    error: 'unknown endpoint'
  })
}

const errorHandler = (error, req, res, next) => {
  if (res.headersSent) {
    return next(error)
  }

  if (error instanceof UniqueConstraintError) {
    return res.status(400).json({
      error: error.errors.map(item => item.message)
    })
  }

  if (error instanceof ValidationError) {
    return res.status(400).json({
      error: error.errors.map(item => item.message)
    })
  }

  if (error instanceof ForeignKeyConstraintError) {
    return res.status(400).json({
      error: 'invalid reference to another record'
    })
  }

  if (
    error.name === 'JsonWebTokenError' ||
    error.name === 'TokenExpiredError' ||
    error.name === 'NotBeforeError'
  ) {
    return res.status(401).json({
      error: 'token invalid or expired'
    })
  }

  if (error.status && error.status >= 400 && error.status < 500) {
    return res.status(error.status).json({
      error: error.message
    })
  }

  console.error(error)

  return res.status(500).json({
    error: 'internal server error'
  })
}

module.exports = {
  httpError,
  asyncHandler,
  tokenExtractor,
  unknownEndpoint,
  errorHandler
}
