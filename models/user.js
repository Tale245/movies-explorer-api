const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const { isEmail } = require('validator');

const userSchema = new mongoose.Schema(
  {
    email: {
      type: String,
      unique: true,
      require: true,
      validate: {
        validator: (v) => isEmail(v),
      },
    },
    password: {
      type: String,
      require: true,
      select: false,
    },
    name: {
      type: String,
      require: true,
      minlength: 2,
      maxlength: 30,
    },
  },
  {
    versionKey: false,
  },
);
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email }).select('+password')
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error({ message: 'Неправильный пользователь или пароль' }));
      }
      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error({ message: 'Неправильный пользователь или пароль' }));
          }
          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
