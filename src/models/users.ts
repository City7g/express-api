import mongoose from 'mongoose'
import { createPassword } from '../utils/hashPassword'
import { faker } from '@faker-js/faker'
const { Schema } = mongoose

const UserSchema = new Schema(
  {
    name: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
    },
    password: {
      type: String,
      required: true,
      select: true,
    },
    files: [
      {
        type: Schema.Types.ObjectId,
        ref: 'File',
      },
    ],
  },
  {
    timestamps: true,
  }
)

UserSchema.pre('save', function (next) {
  console.log(this)

  // this.password = createPassword(this.password)

  next()
})

const User = mongoose.model('User', UserSchema)

export default User
