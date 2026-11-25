
const { Model, DataTypes } = require('sequelize')
const { sequelize } = require('../util/db')

class User extends Model {}

User.init({
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true
  },
  username: {
    type: DataTypes.TEXT,
    allowNull: false,
    unique: {
      msg: 'username must be unique'
    },
    validate: {
      notEmpty: {
        msg: 'username must not be empty'
      },
      isEmail: {
        msg: 'username must be a valid email address'
      }
    }
  },
  name: {
    type: DataTypes.TEXT,
    allowNull: false,
    validate: {
      notEmpty: {
        msg: 'name must not be empty'
      }
    }
  }
}, {
  sequelize,
  modelName: 'user',
  tableName: 'users',
  underscored: true,
  timestamps: true
})

module.exports = User
