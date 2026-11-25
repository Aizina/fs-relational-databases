
const Blog = require('./blog')
const User = require('./user')
const ReadingList = require('./readinglist')
const Session = require('./session')

User.hasMany(Blog, {
  foreignKey: 'userId',
  as: 'blogs'
})

Blog.belongsTo(User, {
  foreignKey: 'userId',
  as: 'user',
  onDelete: 'SET NULL',
  onUpdate: 'CASCADE'
})

User.belongsToMany(Blog, {
  through: ReadingList,
  as: 'readings',
  foreignKey: 'userId',
  otherKey: 'blogId'
})

Blog.belongsToMany(User, {
  through: ReadingList,
  as: 'readers',
  foreignKey: 'blogId',
  otherKey: 'userId'
})

User.hasMany(Session, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

Session.belongsTo(User, {
  foreignKey: 'userId',
  onDelete: 'CASCADE'
})

module.exports = {
  Blog,
  User,
  ReadingList,
  Session
}
