import { model, models, Schema, Document } from "mongoose";

export interface IUser extends Document {
  name: string;
  email: string;
  username?: string;
  password?: string;
  isOnline: boolean;
  lastActive: Date;
  googleId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    name: {
      type: String,
      required: true,
      trim: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },

    username: {
      type: String,
      unique: true,
      sparse: true,
      trim: true,
      lowercase: true,
    },

    password: {
      type: String,
    },

    googleId: {
      type: String,
    },

    isOnline: {
      type: Boolean,
      default: false,
    },

    lastActive: {
      type: Date,
      default: Date.now,
    },
  },
  {
    timestamps: true,
  },
);

const UserModel = models.User || model<IUser>("User", UserSchema);

export default UserModel;
