const mongoose = require('mongoose');
const validator = require('validator');

const UserSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },
    surname: {
      type: String,
      required: true,
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      validate: [validator.isEmail, 'Provided email is invalid'],
    },
    devices: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Device',
      },
    ],
  },
  { timestamps: true }
);

const User = mongoose.model('User', UserSchema);

module.exports = User;
