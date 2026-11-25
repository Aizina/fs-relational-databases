
require('dotenv').config()

const express = require('express')
const { Sequelize, Model, DataTypes } = require('sequelize')

const app = express()
app.use(express.json())

const sequelize = new Sequelize(process.env.DATABASE_URL)

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
    defaultValue: 0
  }
}, {
  sequelize,
  modelName: 'blog',
  tableName: 'blogs',
  timestamps: false
})

app.get('/api/blogs', async (req, res) => {
  const blogs = await Blog.findAll()
  res.json(blogs)
})

app.post('/api/blogs', async (req, res) => {
  try {
    const blog = await Blog.create(req.body, {
      fields: ['author', 'url', 'title', 'likes']
    })
    res.status(201).json(blog)
  } catch (error) {
    res.status(400).json({ error: error.message })
  }
})

app.delete('/api/blogs/:id', async (req, res) => {
  const blog = await Blog.findByPk(req.params.id)

  if (blog) {
    await blog.destroy()
  }

  res.status(204).end()
})

const PORT = process.env.PORT || 3001

const start = async () => {
  try {
    await sequelize.authenticate()
    console.log('Connected to PostgreSQL')

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`)
    })
  } catch (error) {
    console.error('Unable to connect to the database:', error)
    process.exitCode = 1
  }
}

start()
