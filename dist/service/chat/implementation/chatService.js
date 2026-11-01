"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class ChatService {
    _chatRepository;
    constructor(chatRepository) {
        this._chatRepository = chatRepository;
    }
    async getChats(userId, role) {
        const response = await this._chatRepository.getChats(userId, role);
        return response;
    }
    async createChat(receiverId, userId) {
        const response = await this._chatRepository.createChat(receiverId, userId);
        return response;
    }
}
exports.default = ChatService;
//# sourceMappingURL=chatService.js.map