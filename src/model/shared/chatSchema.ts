import mongoose, { Document, Schema } from "mongoose";

interface IMessage {
    sender: mongoose.Types.ObjectId;
    receiver: mongoose.Types.ObjectId;
    content: string;
    isRead: boolean;
    createdAt: Date;
}

export interface IChat extends Document {
    participants: mongoose.Types.ObjectId[];
    messages: IMessage[];
}

const MessageSchema = new Schema<IMessage>({
    sender: { type: Schema.Types.ObjectId, ref: "User", required: true },
    receiver: { type: Schema.Types.ObjectId, ref: "User", required: true },
    content: { type: String, required: true },
    isRead: { type: Boolean, default: false },
    createdAt: { type: Date, default: Date.now },
});

const ChatSchema = new Schema<IChat>({
    participants: [{ type: Schema.Types.ObjectId, ref: "User" }],
    messages: [MessageSchema],
});

export default mongoose.model<IChat>("Chat", ChatSchema);
