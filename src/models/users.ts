import { DataTypes } from 'sequelize'
import { sequelize } from '../db/connection'
import { createPassword } from '../utils/hashPassword'

const User = sequelize.define(
  'users',
  {
    id: {
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
      type: DataTypes.INTEGER,
    },
    name: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
    },
  },
  {
    hooks: {
      beforeCreate(user) {
        user.setDataValue('password', createPassword(user.dataValues.password))
      },
      beforeUpdate(user) {
        if (user.dataValues.password) {
          user.setDataValue(
            'password',
            createPassword(user.dataValues.password)
          )
        }
      },
    },
  }
)

export default User
