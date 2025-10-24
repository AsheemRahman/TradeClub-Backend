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
Object.defineProperty(exports, "__esModule", { value: true });
exports.getIO = exports.getReceiverSocketId = void 0;
const socket_io_1 = require("socket.io");
const userSchema_1 = require("../model/user/userSchema");
const userSocketMap = {};
let io = null;
const getReceiverSocketId = (receiverId) => {
    return userSocketMap[receiverId];
};
exports.getReceiverSocketId = getReceiverSocketId;
const getIO = () => io;
exports.getIO = getIO;
const configureSocket = (server) => {
    io = new socket_io_1.Server(server, { cors: { origin: "*", methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"] } });
    io.on("connection", (socket) => {
        console.log("New client connected:", socket.id, "User ID:", socket.handshake.query.userId);
        console.log("A user connected", socket.id);
        const userId = Array.isArray(socket.handshake.query.userId)
            ? socket.handshake.query.userId[0]
            : socket.handshake.query.userId;
        if (userId) {
            userSocketMap[userId] = socket.id;
            io === null || io === void 0 ? void 0 : io.emit("getOnlineUser", Object.keys(userSocketMap));
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
                io === null || io === void 0 ? void 0 : io.to(receiverSocketId).emit("typing", { from });
            }
        });
        socket.on("stop_typing", ({ from, to }) => {
            const receiverSocketId = userSocketMap[to];
            if (receiverSocketId) {
                io === null || io === void 0 ? void 0 : io.to(receiverSocketId).emit("stop_typing", { from });
            }
        });
        socket.on("disconnect", () => __awaiter(void 0, void 0, void 0, function* () {
            console.log("User disconnected", socket.id);
            if (userId) {
                delete userSocketMap[userId];
                io === null || io === void 0 ? void 0 : io.emit("getOnlineUser", Object.keys(userSocketMap));
                try {
                    yield userSchema_1.User.findByIdAndUpdate(userId, { lastSeen: new Date(), });
                    io === null || io === void 0 ? void 0 : io.emit("userLastSeen", { userId, lastSeen: new Date() });
                }
                catch (err) {
                    console.error("Error updating lastSeen:", err);
                }
            }
        }));
    });
};
exports.default = configureSocket;
