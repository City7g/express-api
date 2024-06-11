import mongoose from 'mongoose'

const isValidObjectId = (id: any) => {
  return mongoose.Types.ObjectId.isValid(id)
}

export default isValidObjectId
