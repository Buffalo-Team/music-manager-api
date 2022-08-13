import { Schema, model } from 'mongoose';
import validator from 'validator';

const UserSchema = new Schema(
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
        type: Schema.Types.ObjectId,
        ref: 'Device',
      },
    ],
  },
  { timestamps: true }
);

const User = model('User', UserSchema);

export default User;
