import mongoose from 'mongoose'
// import bcrypt from 'bcrypt'

const userSchema = new mongoose.Schema(
  {
    name: String,
    role: {
      type: [String],
      default: ['user']
    },
    e_mail: String,
    password: String
  },
  {
    timestamp: true // чтобы были поля любого изменения объекта с 'time' этого изменения
  }
)

export default mongoose.model('users', userSchema)
