
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class Blog extends Model {}

Blog.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  author: {
    type: DataTypes.TEXT
  },
  url: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  title: {
    type: DataTypes.TEXT,
    allowNull: false
  },
  likes: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 0,
    validate: {
      isInt: true,
      min: 0
    }
  },
  year: {
    type: DataTypes.INTEGER,
    allowNull: true,
    validate: {
      isInt: {
        msg: 'year must be an integer'
      },
      min: {
        args: [1991],
        msg: 'year must be at least 1991'
      },
      notInFuture(value) {
        if (value > new Date().getFullYear()) {
          throw new Error(
            'year must not be greater than the current year'
          )
        }
      }
    }
  },
  userId: {
    type: DataTypes.INTEGER,
    allowNull: true
  }
}, {
  sequelize,
  modelName: 'blog',
  tableName: 'blogs',
  underscored: true,
  timestamps: true
})

module.exports = Blog
