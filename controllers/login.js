
const router = require('express').Router()
const jwt = require('jsonwebtoken')

const { User } = require('../models')
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

  const userForToken = {
    username: user.username,
    id: user.id
  }

  const token = jwt.sign(
    userForToken,
    SECRET,
    {
      expiresIn: '7d'
    }
  )

  res.status(200).json({
    token,
    username: user.username,
    name: user.name
  })
}))

module.exports = router
