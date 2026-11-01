"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = __importDefault(require("mongoose"));
const chatSchema_1 = require("../../../model/shared/chatSchema");
const messageSchema_1 = require("../../../model/shared/messageSchema");
const socketConfig_1 = require("../../../config/socketConfig");
class MessageRepository {
    async sendMessage(receiverId, senderId, message, imageUrl) {
        let chat = await chatSchema_1.Chat.findOne({
            participants: { $all: [senderId, receiverId] },
        });
        if (!chat) {
            chat = await chatSchema_1.Chat.create({
                participants: [senderId, receiverId],
            });
        }
        const newMessage = new messageSchema_1.Message({
            senderId,
            receiverId,
            message,
            imageUrl,
            isRead: false,
        });
        if (newMessage) {
            chat.messages.push(newMessage._id);
            chat.lastMessage = message || (imageUrl ? '[Image]' : '');
            chat.updatedAt = new Date();
        }
        await Promise.all([chat.save(), newMessage.save()]);
        return newMessage;
    }
    async getMessage(userToChat, senderId) {
        const chat = await chatSchema_1.Chat.findOne({
            participants: { $all: [senderId, userToChat] },
        }).populate('messages');
        return chat ? chat.messages : [];
    }
    async deleteMessages(messagesIds) {
        try {
            const objectIds = messagesIds.map((id) => new mongoose_1.default.Types.ObjectId(id));
            const updatedMessages = await messageSchema_1.Message.updateMany({ _id: { $in: objectIds } }, { $set: { isDeleted: true } });
            const softDeletedMessages = await messageSchema_1.Message.find({ _id: { $in: objectIds } });
            return softDeletedMessages;
        }
        catch (error) {
            console.error('Error in deleteMessages:', error);
            return [];
        }
    }
    async markMessagesAsRead(receiverId, senderId) {
        try {
            const result = await messageSchema_1.Message.updateMany({
                senderId: receiverId, // Messages sent by the other user
                receiverId: senderId, // Received by the current user
                isRead: false,
                isDeleted: { $ne: true },
            }, { $set: { isRead: true } });
            // Emit Socket.IO event to notify the sender
            const io = (0, socketConfig_1.getIO)();
            const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
            if (io && receiverSocketId) {
                io.to(receiverSocketId).emit('messagesRead', {
                    senderId,
                    receiverId,
                    unreadCount: 0, // Notify that unread count is now 0
                });
            }
            return result.modifiedCount > 0;
        }
        catch (error) {
            console.error('Error marking messages as read:', error);
            return null;
        }
    }
}
exports.default = MessageRepository;
//# sourceMappingURL=messageRepository.js.map