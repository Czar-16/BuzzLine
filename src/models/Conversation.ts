import { model, models, ObjectId, Schema, Types, Document } from "mongoose";

export interface IConversation extends Document {
  participants: Types.ObjectId[];
  latestMessage?: Types.ObjectId;
  createdAt: Date;
  updatedAt: Date;
}

const ConversationSchema = new Schema<IConversation>(
  {
    participants: [
      {
        type: Schema.Types.ObjectId,
        ref: "User",
        required: true,
      },
    ],

    latestMessage: {
      type: Schema.Types.ObjectId,
      ref: "Message",
    },
  },
  {
    timestamps: true,
  },
);

const ConversationModel =
  models.Conversation ||
  model<IConversation>("Conversation", ConversationSchema);
export default ConversationModel;
