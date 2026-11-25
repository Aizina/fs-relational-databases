
const router = require('express').Router()

const {
  Blog,
  User,
  ReadingList
} = require('../models')

const {
  asyncHandler,
  tokenExtractor,
  httpError
} = require('../util/middleware')

const isValidId = id => {
  return Number.isInteger(id) &&
    id > 0 &&
    id <= 2147483647
}

router.post('/', asyncHandler(async (req, res) => {
  const { blogId, userId } = req.body || {}

  if (!isValidId(blogId) || !isValidId(userId)) {
    throw httpError(400, 'valid blogId and userId are required')
  }

  const blog = await Blog.findByPk(blogId)

  if (!blog) {
    throw httpError(404, 'blog not found')
  }

  const user = await User.findByPk(userId)

  if (!user) {
    throw httpError(404, 'user not found')
  }

  const existing = await ReadingList.findOne({
    where: {
      blogId,
      userId
    }
  })

  if (existing) {
    throw httpError(400, 'blog is already in the reading list')
  }

  const reading = await ReadingList.create({
    blogId,
    userId,
    read: false
  })

  res.status(201).json(reading)
}))

router.put('/:id', tokenExtractor, asyncHandler(async (req, res) => {
  const id = Number(req.params.id)

  if (!isValidId(id)) {
    throw httpError(400, 'invalid reading list id')
  }

  const reading = await ReadingList.findByPk(id)

  if (!reading) {
    throw httpError(404, 'reading list entry not found')
  }

  if (reading.userId !== req.user.id) {
    throw httpError(401, 'not authorized to modify this reading list')
  }

  const { read } = req.body || {}

  if (typeof read !== 'boolean') {
    throw httpError(400, 'read must be a boolean')
  }

  reading.read = read

  await reading.save()

  res.json(reading)
}))

module.exports = router
