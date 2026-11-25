
const router = require('express').Router()
const jwt = require('jsonwebtoken')
const { randomUUID } = require('node:crypto')

const { User, Session } = require('../models')
const { SECRET } = require('../util/config')

const {
  asyncHandler,
  httpError
} = require('../util/middleware')

router.post('/', asyncHandler(async (req, res) => {
  const { username } = req.body || {}

  if (typeof username !== 'string' || !username.trim()) {
    throw httpError(400, 'username is required')
  }

  const user = await User.findOne({
    where: {
      username
    }
  })

  if (!user) {
    throw httpError(401, 'invalid username')
  }

  if (user.disabled) {
    throw httpError(401, 'user account is disabled')
  }

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(
    userForToken,
    SECRET,
    {
      expiresIn: '7d',
      jwtid: randomUUID()
    }
  )

  await Session.create({
    userId: user.id,
    token
  })

  res.status(200).json({
    token,
    username: user.username,
    name: user.name
  })
}))

module.exports = router
