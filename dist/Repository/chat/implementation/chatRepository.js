"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
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
    getChats(userId, role) {
        return __awaiter(this, void 0, void 0, function* () {
            var _a, _b, _c;
            try {
                const userObjectId = new mongoose_1.default.Types.ObjectId(userId);
                // Find all chats containing the current user
                const chats = yield chatSchema_1.Chat.find({ participants: userObjectId }).sort({ updatedAt: -1 }).select('participants lastMessage updatedAt').lean();
                if (!chats.length)
                    return [];
                const otherUserData = [];
                for (const chat of chats) {
                    const otherParticipant = chat.participants.find((id) => !id.equals(userObjectId));
                    if (!otherParticipant)
                        continue;
                    const otherUserId = otherParticipant.toString();
                    // Calculate unread messages
                    const unreadCount = yield messageSchema_1.Message.countDocuments({
                        senderId: otherUserId,
                        receiverId: userId,
                        isRead: false,
                        isDeleted: { $ne: true },
                    });
                    if (role === 'Expert') {
                        const student = yield userSchema_1.User.findById(otherUserId).select('_id fullName profilePicture role').lean();
                        if (student) {
                            otherUserData.push({
                                _id: student._id.toString(),
                                fullName: (_a = student.fullName) !== null && _a !== void 0 ? _a : '',
                                profilePicture: student.profilePicture,
                                role: 'User',
                                lastMessage: chat.lastMessage || '',
                                unreadCount,
                                updatedAt: (_b = chat.updatedAt) === null || _b === void 0 ? void 0 : _b.toISOString(),
                            });
                        }
                    }
                    else if (role === 'User') {
                        const tutor = yield expertSchema_1.Expert.findById(otherUserId).select('_id fullName role profilePicture').lean();
                        if (tutor) {
                            otherUserData.push({
                                _id: tutor._id.toString(),
                                fullName: tutor.fullName,
                                profilePicture: tutor.profilePicture,
                                role: 'Expert',
                                lastMessage: chat.lastMessage || '',
                                unreadCount,
                                updatedAt: (_c = chat.updatedAt) === null || _c === void 0 ? void 0 : _c.toISOString(),
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
        });
    }
    createChat(receiverId, userId) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const existingChat = yield chatSchema_1.Chat.findOne({
                    participants: { $all: [userId, receiverId], $size: 2 },
                });
                if (existingChat) {
                    return existingChat;
                }
                const newChat = yield chatSchema_1.Chat.create({
                    participants: [userId, receiverId],
                });
                return newChat;
            }
            catch (error) {
                console.error('Error creating chat:', error);
                return null;
            }
        });
    }
}
exports.default = ChatRepository;
