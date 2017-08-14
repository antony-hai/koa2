const mongoose = require('mongoose')
const bcrypt = require('bcrypt')
const SALT_WORK_FACTOR = 10

const UserSchema = new mongoose.Schema({
  password: String,
  name: {
    type: String,
    unique: true,
  },
  meta: {
    createAt: {
      type: Date,
      default: Date.now()
    },
    updateAt: {
      type: Date,
      default: Date.now()
    }
  },
})

UserSchema.pre('save', async function(next) {
  if (this.isNew) {
    this.meta.createAt = this.meta.updateAt = Date.now()
  } else {
    this.meta.updateAt = Date.now()
  }
  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR)
    const hashSalt = await bcrypt.hash(this.password, salt)
    this.password = hashSalt
    await next()
  } catch (err) {
    return next(err)
  }
  await next()
})

UserSchema.methods = {
  comparePassword: async function(password) {
    try {
      const isMatch = await bcrypt.compare(password, this.password)
      return isMatch
    } catch (e) {
      console.log(e)
    }
  }
}
UserSchema.statics = {
  fetch: function() {
    return this
      .find({})
      .sort('meta.updateAt')
      .exec()
  },
  findById: function(id) {
    return this
      .findOne({ _id: id })
      .exec()
  },
  findByName: function(name) {
    return this
      .findOne({ name: name })
      .exec()
  }
}

module.exports = UserSchema
