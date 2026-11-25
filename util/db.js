
const { Sequelize, DataTypes } = require('sequelize')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()

    const { User, Blog } = require('../models')

    await User.sync()
    await Blog.sync()

    const queryInterface = sequelize.getQueryInterface()
    const columns = await queryInterface.describeTable('blogs')

    if (!columns.user_id) {
      await queryInterface.addColumn('blogs', 'user_id', {
        type: DataTypes.INTEGER,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id'
        },
        onUpdate: 'CASCADE',
        onDelete: 'SET NULL'
      })
    }

    console.log('Connected to PostgreSQL')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = {
  sequelize,
  connectToDatabase
}
