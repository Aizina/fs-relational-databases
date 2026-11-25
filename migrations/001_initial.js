
const { DataTypes } = require('sequelize')

module.exports = {
  up: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.createTable('users', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
        },
        username: {
          type: DataTypes.TEXT,
          allowNull: false,
          unique: true
        },
        name: {
          type: DataTypes.TEXT,
          allowNull: false
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, { transaction })

      await queryInterface.createTable('blogs', {
        id: {
          type: DataTypes.INTEGER,
          primaryKey: true,
          autoIncrement: true,
          allowNull: false
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
          defaultValue: 0
        },
        user_id: {
          type: DataTypes.INTEGER,
          allowNull: true,
          references: {
            model: 'users',
            key: 'id'
          },
          onDelete: 'SET NULL',
          onUpdate: 'CASCADE'
        },
        created_at: {
          type: DataTypes.DATE,
          allowNull: false
        },
        updated_at: {
          type: DataTypes.DATE,
          allowNull: false
        }
      }, { transaction })
    })
  },

  down: async ({ context: queryInterface }) => {
    await queryInterface.sequelize.transaction(async transaction => {
      await queryInterface.dropTable('blogs', { transaction })
      await queryInterface.dropTable('users', { transaction })
    })
  }
}
