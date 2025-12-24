import mongoose from "mongoose";

const conversationSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  title: {
    type: String,
    default: "Nueva conversación",
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export default mongoose.model("Conversation", conversationSchema);
