import bcrypt from 'bcrypt'

const createPassword = (password: string): string => {
  return bcrypt.hashSync(password, 10)
}

const comparePassword = (password: string, value: string): boolean => {
  return bcrypt.compareSync(password, value)
}

export { createPassword, comparePassword }
