"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const chatSchema_1 = require("../../../model/shared/chatSchema");
const messageSchema_1 = require("../../../model/shared/messageSchema");
const userSchema_1 = require("../../../model/user/userSchema");
const expertSchema_1 = require("../../../model/expert/expertSchema");
const mongoose_1 = __importDefault(require("mongoose"));
class ChatRepository {
    async getChats(userId, role) {
        try {
            const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
            // Find all chats containing the current user
            const chats = await chatSchema_1.Chat.find({ participants: userObjectId }).sort({ updatedAt: -1 }).select('participants lastMessage updatedAt').lean();
            if (!chats.length)
                return [];
            const otherUserData = [];
            for (const chat of chats) {
                const otherParticipant = chat.participants.find((id) => !id.equals(userObjectId));
                if (!otherParticipant)
                    continue;
                const otherUserId = otherParticipant.toString();
                // Calculate unread messages
                const unreadCount = await messageSchema_1.Message.countDocuments({
                    senderId: otherUserId,
                    receiverId: userId,
                    isRead: false,
                    isDeleted: { $ne: true },
                });
                if (role === 'Expert') {
                    const student = await userSchema_1.User.findById(otherUserId).select('_id fullName profilePicture role').lean();
                    if (student) {
                        otherUserData.push({
                            _id: student._id.toString(),
                            fullName: student.fullName ?? '',
                            profilePicture: student.profilePicture,
                            role: 'User',
                            lastMessage: chat.lastMessage || '',
                            unreadCount,
                            updatedAt: chat.updatedAt?.toISOString(),
                        });
                    }
                }
                else if (role === 'User') {
                    const tutor = await expertSchema_1.Expert.findById(otherUserId).select('_id fullName role profilePicture').lean();
                    if (tutor) {
                        otherUserData.push({
                            _id: tutor._id.toString(),
                            fullName: tutor.fullName,
                            profilePicture: tutor.profilePicture,
                            role: 'Expert',
                            lastMessage: chat.lastMessage || '',
                            unreadCount,
                            updatedAt: chat.updatedAt?.toISOString(),
                        });
                    }
                }
            }
            return otherUserData;
        }
        catch (error) {
            console.error('Error fetching chats:', error);
            return null;
        }
    }
    async createChat(receiverId, userId) {
        try {
            const existingChat = await chatSchema_1.Chat.findOne({
                participants: { $all: [userId, receiverId], $size: 2 },
            });
            if (existingChat) {
                return existingChat;
            }
            const newChat = await chatSchema_1.Chat.create({
                participants: [userId, receiverId],
            });
            return newChat;
        }
        catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    }
}
exports.default = ChatRepository;
//# sourceMappingURL=chatRepository.js.map