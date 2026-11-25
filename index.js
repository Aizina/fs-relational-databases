
const express = require('express')

const { PORT, TESTING, SECRET } = require('./util/config')
const { connectToDatabase } = require('./util/db')

const blogsRouter = require('./controllers/blogs')
const usersRouter = require('./controllers/users')
const loginRouter = require('./controllers/login')
const authorsRouter = require('./controllers/authors')
const resetRouter = require('./controllers/reset')

const {
  unknownEndpoint,
  errorHandler
} = require('./util/middleware')

const app = express()

app.use(express.json())

app.get('/', (req, res) => {
  res.sendStatus(200)
})

app.use('/api/blogs', blogsRouter)
app.use('/api/users', usersRouter)
app.use('/api/login', loginRouter)
app.use('/api/authors', authorsRouter)

if (TESTING) {
  app.use('/api/reset', resetRouter)
}

app.use(unknownEndpoint)
app.use(errorHandler)

const start = async () => {
  if (!SECRET) {
    console.error('SECRET is missing')
    process.exit(1)
  }

  await connectToDatabase()

  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
    console.log(`Testing mode: ${TESTING}`)
  })
}

start()
