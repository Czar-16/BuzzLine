import { model, models, Schema, Types, Document } from "mongoose";

export interface IMessage extends Document {
  sender: Types.ObjectId;
  conversation: Types.ObjectId;
  text: string;
  seen: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const MessageSchema = new Schema<IMessage>(
  {
    sender: {
      type: Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    conversation: {
      type: Schema.Types.ObjectId,
      ref: "Conversation",
      required: true,
    },

    text: {
      type: String,
      required: true,
      trim: true,
    },

    seen: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
  },
);

const MessageModel =
  models.Message || model<IMessage>("Message", MessageSchema);

export default MessageModel;
