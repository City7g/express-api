import { Dialect, Sequelize } from 'sequelize'
import dotenv from 'dotenv'

dotenv.config()

export const sequelize = new Sequelize(
  process.env.DB_DATABASE || 'database',
  process.env.DB_USERNAME || 'username',
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    dialect: (process.env.DB_CONNECTION as Dialect) || 'mysql',
    logging: true,
  }
)
