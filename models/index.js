
const Blog = require('./blog')
const User = require('./user')

User.hasMany(Blog, {
  foreignKey: 'userId'
})

Blog.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

module.exports = {
  Blog,
  User
}
