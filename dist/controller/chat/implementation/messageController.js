"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class MessageController {
    _messageService;
    constructor(messageService) {
        this._messageService = messageService;
    }
    sendMessage = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: receiverId } = req.params;
        const { message, imageUrl } = req.body;
        const senderId = req.userId;
        const response = await this._messageService.sendMessage(receiverId, senderId, message, imageUrl);
        res.status(statusCode_1.STATUS_CODES.CREATED).json({
            success: true,
            message: 'Message sent successfully',
            data: response,
        });
    });
    getMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: userToChat } = req.params;
        const senderId = req.userId;
        const response = await this._messageService.getMessage(userToChat, senderId);
        res.status(statusCode_1.STATUS_CODES.OK).json({
            success: true,
            message: 'Messages retrieved successfully',
            data: response,
        });
    });
    deleteMessages = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: receiverId } = req.params;
        const messagesIds = req.body.messageIds;
        const response = await this._messageService.deleteMessages(receiverId, messagesIds);
        res.status(statusCode_1.STATUS_CODES.OK).json({
            success: true,
            message: 'Messages deleted successfully',
            data: response,
        });
    });
    markMessagesAsRead = (0, asyncHandler_1.asyncHandler)(async (req, res) => {
        const { id: receiverId } = req.params;
        const senderId = req.userId;
        const response = await this._messageService.markMessagesAsRead(receiverId, senderId);
        res.status(statusCode_1.STATUS_CODES.OK).json({
            success: true,
            message: 'Messages marked as read',
            data: response,
        });
    });
}
exports.default = MessageController;
//# sourceMappingURL=messageController.js.map