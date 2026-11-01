"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const socketConfig_1 = require("../../../config/socketConfig");
class MessageService {
    _messageRepository;
    constructor(chatRepository) {
        this._messageRepository = chatRepository;
    }
    async sendMessage(receiverId, senderId, message, imageUrl) {
        const response = await this._messageRepository.sendMessage(receiverId, senderId, message, imageUrl);
        const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
        const io = (0, socketConfig_1.getIO)();
        if (receiverSocketId && io) {
            io.to(receiverSocketId).emit("newMessage", response);
        }
        return response;
    }
    async getMessage(userToChat, senderId) {
        const response = await this._messageRepository.getMessage(userToChat, senderId);
        return response;
    }
    async deleteMessages(receiverId, messagesIds) {
        const response = await this._messageRepository.deleteMessages(messagesIds);
        const receiverSocketId = (0, socketConfig_1.getReceiverSocketId)(receiverId);
        const io = (0, socketConfig_1.getIO)();
        if (receiverSocketId && io) {
            io.to(receiverSocketId).emit('deleteMessage', response);
        }
        return response;
    }
    async markMessagesAsRead(receiverId, senderId) {
        try {
            const response = await this._messageRepository.markMessagesAsRead(receiverId, senderId);
            return response;
        }
        catch (error) {
            console.error('Error in markMessagesAsRead service:', error);
            return null;
        }
    }
}
exports.default = MessageService;
//# sourceMappingURL=messageService.js.map