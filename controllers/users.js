
const router = require('express').Router()
const { User, Blog } = require('../models')

const {
  asyncHandler,
  httpError
} = require('../util/middleware')

router.get('/', asyncHandler(async (req, res) => {
  const users = await User.findAll({
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })

  res.json(users)
}))

router.post('/', asyncHandler(async (req, res) => {
  const { username, name } = req.body || {}

  const user = await User.create({
    username,
    name
  })

  res.status(201).json(user)
}))

router.get('/:id', asyncHandler(async (req, res) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw httpError(400, 'invalid user id')
  }

  const user = await User.findByPk(id, {
    include: {
      model: Blog,
      attributes: {
        exclude: ['userId']
      }
    }
  })

  if (!user) {
    throw httpError(404, 'user not found')
  }

  res.json(user)
}))

router.put('/:username', asyncHandler(async (req, res) => {
  const user = await User.findOne({
    where: {
      username: req.params.username
    }
  })

  if (!user) {
    throw httpError(404, 'user not found')
  }

  const { name } = req.body || {}

  if (typeof name !== 'string' || !name.trim()) {
    throw httpError(400, 'name must not be empty')
  }

  user.name = name

  await user.save()

  res.json(user)
}))

module.exports = router
