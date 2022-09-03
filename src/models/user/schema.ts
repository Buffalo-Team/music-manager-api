import { Schema, model } from 'mongoose';
import validator from 'validator';
import bcrypt from 'bcryptjs';
import normalizeOutput from 'utils/normalizeOutput';
import { IUser, IUserDTO, UserModel, IUserMethods } from '.';

const MIN_PASSWORD_LENGTH = 3;

const UserSchema = new Schema<IUser, UserModel, IUserMethods>(
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
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [
        MIN_PASSWORD_LENGTH,
        `Password must have at least ${MIN_PASSWORD_LENGTH} characters`,
      ],
    },
    passwordConfirm: {
      type: String,
      required: [true, 'Password confirmation is required'],
      validate: {
        validator(this: IUser, el: string) {
          return el === this.password;
        },
        message: "Passwords don't match",
      },
      select: false,
    },
  },
  { timestamps: true }
);

UserSchema.method('toJSON', normalizeOutput);

UserSchema.method('mapToDTO', function (this: IUser): IUserDTO {
  const { id, name, surname } = this;

  return {
    id,
    name,
    surname,
  };
});

UserSchema.method(
  'isCorrectPassword',
  async function (this: IUser, password: string) {
    return bcrypt.compare(password, this.password);
  }
);

UserSchema.pre('save', async function (next) {
  try {
    if (!this.isModified('password')) return next();

    this.password = await bcrypt.hash(this.password, 12);

    this.passwordConfirm = undefined;
    next();
  } catch (err) {
    console.log(err);
  }
});

const User = model<IUser, UserModel>('User', UserSchema);

export default User;
