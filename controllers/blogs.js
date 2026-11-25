
const router = require('express').Router()
const { Op } = require('sequelize')
const { Blog, User } = require('../models')

const {
  asyncHandler,
  tokenExtractor,
  httpError
} = require('../util/middleware')

const blogFinder = asyncHandler(async (req, res, next) => {
  const id = Number(req.params.id)

  if (!Number.isInteger(id) || id < 1 || id > 2147483647) {
    throw httpError(400, 'invalid blog id')
  }

  req.blog = await Blog.findByPk(id)

  if (!req.blog) {
    throw httpError(404, 'blog not found')
  }

  next()
})

router.get('/', asyncHandler(async (req, res) => {
  const where = {}

  if (req.query.search) {
    if (typeof req.query.search !== 'string') {
      throw httpError(400, 'invalid search parameter')
    }

    const search = req.query.search.replace(
      /[\\%_]/g,
      '\\$&'
    )

    where[Op.or] = [
      {
        title: {
          [Op.iLike]: `%${search}%`
        }
      },
      {
        author: {
          [Op.iLike]: `%${search}%`
        }
      }
    ]
  }

  const blogs = await Blog.findAll({
    where,
    attributes: {
      exclude: ['userId']
    },
    include: {
      model: User,
      as: 'user',
      attributes: ['id', 'name', 'username']
    },
    order: [
      ['likes', 'DESC'],
      ['id', 'ASC']
    ]
  })

  res.json(blogs)
}))

router.post('/', tokenExtractor, asyncHandler(async (req, res) => {
  const { author, url, title, likes, year } = req.body || {}

  if (
    likes !== undefined &&
    (!Number.isInteger(likes) || likes < 0 || likes > 2147483647)
  ) {
    throw httpError(400, 'likes must be a non-negative integer')
  }

  if (
    year !== undefined &&
    year !== null &&
    !Number.isInteger(year)
  ) {
    throw httpError(400, 'year must be an integer')
  }

  const blog = await Blog.create({
    author,
    url,
    title,
    likes,
    year,
    userId: req.user.id
  })

  res.status(201).json(blog)
}))

router.put('/:id', blogFinder, asyncHandler(async (req, res) => {
  const { likes } = req.body || {}

  if (!Number.isInteger(likes) || likes < 0 || likes > 2147483647) {
    throw httpError(400, 'likes must be a non-negative integer')
  }

  req.blog.likes = likes

  await req.blog.save()

  res.json(req.blog)
}))

router.delete(
  '/:id',
  tokenExtractor,
  blogFinder,
  asyncHandler(async (req, res) => {
    if (req.blog.userId !== req.user.id) {
      throw httpError(403, 'only the owner can delete this blog')
    }

    await req.blog.destroy()

    res.status(204).end()
  })
)

module.exports = router
