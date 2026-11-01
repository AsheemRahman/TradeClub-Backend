"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class ChatController {
    _chatService;
    constructor(chatService) {
        this._chatService = chatService;
    }
    getChats = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { role } = req.query;
        const userId = req.userId;
        const response = await this._chatService.getChats(userId, role);
        res.status(statusCode_1.STATUS_CODES.OK).json({ success: true, message: "Chat retrieved successfully", data: response });
    });
    createChat = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: receiverId } = req.params;
        const userId = req.userId;
        const response = await this._chatService.createChat(receiverId, userId);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({ success: true, message: "Chat created successfully", data: response });
    });
}
exports.default = ChatController;
//# sourceMappingURL=chatController.js.map