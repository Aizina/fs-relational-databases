
const router = require('express').Router()
const { fn, col, literal } = require('sequelize')

const { Blog } = require('../models')
const { asyncHandler } = require('../util/middleware')

router.get('/', asyncHandler(async (req, res) => {
  const authors = await Blog.findAll({
    attributes: [
      'author',
      [fn('COUNT', col('id')), 'blogs'],
      [fn('COALESCE', fn('SUM', col('likes')), 0), 'likes']
    ],
    group: ['author'],
    order: [
      [literal('"likes"'), 'DESC']
    ],
    raw: true
  })

  res.json(authors)
}))

module.exports = router
