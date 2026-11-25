
const router = require('express').Router()

const { Blog, User } = require('../models')
const { sequelize } = require('../util/db')
const { asyncHandler } = require('../util/middleware')

router.post('/', asyncHandler(async (req, res) => {
  await sequelize.transaction(async (transaction) => {
    await Blog.destroy({
      where: {},
      transaction
    })

    await User.destroy({
      where: {},
      transaction
    })
  })

  res.status(204).end()
}))

module.exports = router
