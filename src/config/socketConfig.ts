import { Server } from "socket.io";
import Chat from "../model/shared/chatSchema";

const onlineUsers = new Map();

export default function chatSocketHandler(io: Server) {
    io.on("connection", (socket) => {
        console.log("Socket connected:", socket.id);

        // User joins socket
        socket.on("join", (userId: string) => {
            onlineUsers.set(userId, socket.id);
            console.log(`${userId} joined`);
        });

        // Send message
        socket.on("sendMessage", async ({ senderId, receiverId, content }) => {
            const chat = await Chat.findOneAndUpdate(
                { participants: { $all: [senderId, receiverId] } },
                { $push: { messages: { sender: senderId, receiver: receiverId, content } } },
                { upsert: true, new: true }
            );

            // Emit message to receiver if online
            const receiverSocket = onlineUsers.get(receiverId);
            if (receiverSocket) {
                io.to(receiverSocket).emit("receiveMessage", chat.messages.at(-1));
            }
        });

        socket.on("disconnect", () => {
            console.log("Socket disconnected:", socket.id);
            for (const [userId, socketId] of onlineUsers.entries()) {
                if (socketId === socket.id) onlineUsers.delete(userId);
            }
        });
    });
}
