import { DataTypes } from 'sequelize'
import { sequelize } from '../db/connection'
import User from './users'

const Post = sequelize.define('posts', {
  id: {
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
    type: DataTypes.INTEGER,
  },
  title: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  userId: {
    type: DataTypes.NUMBER,
    references: {
      model: User,
    },
  },
  description: {
    type: DataTypes.TEXT,
    allowNull: false,
  },
})

Post.belongsTo(User)
User.hasMany(Post)

export default Post
