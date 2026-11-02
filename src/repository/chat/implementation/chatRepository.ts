import { Chat, IChat } from '../../../model/shared/chatSchema';
import { Message } from '../../../model/shared/messageSchema';
import { User } from '../../../model/user/userSchema';
import { Expert } from '../../../model/expert/expertSchema';
import { UserMinimal } from '../../../types/IShared';
import IChatRepository from '../IChatRepository';
import mongoose, { Types } from 'mongoose';

class ChatRepository implements IChatRepository {
    async getChats(userId: string, role: string): Promise<UserMinimal[] | null> {
        try {
            const userObjectId = new mongoose.Types.ObjectId(userId);
            // Find all chats containing the current user
            const chats = await Chat.find({ participants: userObjectId }).sort({ updatedAt: -1 }).select('participants lastMessage updatedAt').lean();
            if (!chats.length) return [];
            const otherUserData: UserMinimal[] = [];
            for (const chat of chats) {
                const otherParticipant = chat.participants.find(
                    (id: Types.ObjectId) => !id.equals(userObjectId)
                );
                if (!otherParticipant) continue;
                const otherUserId = otherParticipant.toString();
                // Calculate unread messages
                const unreadCount = await Message.countDocuments({
                    senderId: otherUserId,
                    receiverId: userId,
                    isRead: false,
                    isDeleted: { $ne: true },
                });
                if (role === 'Expert') {
                    const student = await User.findById(otherUserId).select('_id fullName profilePicture role').lean();
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
                } else if (role === 'User') {
                    const tutor = await Expert.findById(otherUserId).select('_id fullName role profilePicture').lean();
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
        } catch (error) {
            console.error('Error fetching chats:', error);
            return null;
        }
    }

    async createChat(receiverId: string, userId: string): Promise<IChat | null> {
        try {
            const existingChat = await Chat.findOne({
                participants: { $all: [userId, receiverId], $size: 2 },
            });

            if (existingChat) {
                return existingChat;
            }

            const newChat = await Chat.create({
                participants: [userId, receiverId],
            });

            return newChat;
        } catch (error) {
            console.error('Error creating chat:', error);
            return null;
        }
    }
}

export default ChatRepository;