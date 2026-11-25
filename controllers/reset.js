
const router = require('express').Router()

const {
  Blog,
  User,
  ReadingList,
  Session
} = require('../models')

const { sequelize } = require('../util/db')
const { asyncHandler } = require('../util/middleware')

router.post('/', asyncHandler(async (req, res) => {
  await sequelize.transaction(async transaction => {
    await Session.destroy({
      where: {},
      transaction
    })

    await ReadingList.destroy({
      where: {},
      transaction
    })

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
