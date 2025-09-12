import { Server } from "socket.io";
import { Server as HttpServer } from "http";
import { User } from "../model/user/userSchema";

const userSocketMap: { [key: string]: string } = {};

let io: Server | null = null;

export const getReceiverSocketId = (receiverId: string) => {
    return userSocketMap[receiverId];
};

export const getIO = () => io;

const configureSocket = (server: HttpServer) => {
    io = new Server(server, { cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] } });

    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id, "User ID:", socket.handshake.query.userId);
        console.log("A user connected", socket.id);

        const userId = Array.isArray(socket.handshake.query.userId)
            ? socket.handshake.query.userId[0]
            : socket.handshake.query.userId;

        if (userId) {
            userSocketMap[userId] = socket.id;
            io?.emit("getOnlineUser", Object.keys(userSocketMap));
        }

        console.log("online users", userSocketMap);

        // Join a session room
        socket.on("join-session", ({ sessionId, userId, role }) => {
            socket.join(sessionId);
            console.log(`${role} ${userId} joined session ${sessionId}`);
            socket.to(sessionId).emit("user-joined", { userId, role });
        });

        // Handle WebRTC signaling messages
        socket.on("offer", ({ sessionId, offer, fromUserId }) => {
            console.log(`Offer from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("offer", { offer, fromUserId });
        });

        socket.on("answer", ({ sessionId, answer, fromUserId }) => {
            console.log(`Answer from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("answer", { answer });
        });

        socket.on("ice-candidate", ({ sessionId, candidate, fromUserId }) => {
            console.log(`ICE candidate from ${fromUserId} in session ${sessionId}`);
            socket.to(sessionId).emit("ice-candidate", { candidate });
        });

        // Handle session end
        socket.on("end-session", ({ sessionId }) => {
            console.log(`Session ${sessionId} ended`);
            socket.to(sessionId).emit("session-ended");
            socket.leave(sessionId);
        });

        socket.on("typing", ({ from, to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                io?.to(receiverSocketId).emit("typing", { from });
            }
        });

        socket.on("stop_typing", ({ from, to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                io?.to(receiverSocketId).emit("stop_typing", { from });
            }
        });

        socket.on("disconnect", async () => {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete userSocketMap[userId];
                io?.emit("getOnlineUser", Object.keys(userSocketMap));
                try {
                    await User.findByIdAndUpdate(userId, { lastSeen: new Date(), });
                    io?.emit("userLastSeen", { userId, lastSeen: new Date() });
                } catch (err) {
                    console.error("Error updating lastSeen:", err);
                }
            }
        });
    });
};

export default configureSocket;