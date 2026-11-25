
const { Sequelize } = require('sequelize')
const { Umzug, SequelizeStorage } = require('umzug')
const { DATABASE_URL } = require('./config')

const sequelize = new Sequelize(DATABASE_URL)

const migrator = new Umzug({
  migrations: {
    glob: 'migrations/*.js'
  },
  storage: new SequelizeStorage({
    sequelize,
    tableName: 'migrations'
  }),
  context: sequelize.getQueryInterface(),
  logger: console
})

const runMigrations = async () => {
  const migrations = await migrator.up()

  console.log('Migrations up to date', {
    files: migrations.map(migration => migration.name)
  })
}

const rollbackMigration = async () => {
  await sequelize.authenticate()
  await migrator.down()
}

const connectToDatabase = async () => {
  try {
    await sequelize.authenticate()
    await runMigrations()

    console.log('Connected to PostgreSQL')
  } catch (error) {
    console.error('Database connection failed:', error)
    process.exit(1)
  }
}

module.exports = {
  sequelize,
  connectToDatabase,
  rollbackMigration
}
