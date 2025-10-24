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
const statusCode_1 = require("../../../constants/statusCode");
const asyncHandler_1 = require("../../../utils/asyncHandler");
class MessageController {
    constructor(messageService) {
        this.sendMessage = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: receiverId } = req.params;
            const { message, imageUrl } = req.body;
            const senderId = req.userId;
            const response = yield this._messageService.sendMessage(receiverId, senderId, message, imageUrl);
            res.status(statusCode_1.STATUS_CODES.CREATED).json({
                success: true,
                message: 'Message sent successfully',
                data: response,
            });
        }));
        this.getMessages = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: userToChat } = req.params;
            const senderId = req.userId;
            const response = yield this._messageService.getMessage(userToChat, senderId);
            res.status(statusCode_1.STATUS_CODES.OK).json({
                success: true,
                message: 'Messages retrieved successfully',
                data: response,
            });
        }));
        this.deleteMessages = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: receiverId } = req.params;
            const messagesIds = req.body.messageIds;
            const response = yield this._messageService.deleteMessages(receiverId, messagesIds);
            res.status(statusCode_1.STATUS_CODES.OK).json({
                success: true,
                message: 'Messages deleted successfully',
                data: response,
            });
        }));
        this.markMessagesAsRead = (0, asyncHandler_1.asyncHandler)((req, res) => __awaiter(this, void 0, void 0, function* () {
            const { id: receiverId } = req.params;
            const senderId = req.userId;
            const response = yield this._messageService.markMessagesAsRead(receiverId, senderId);
            res.status(statusCode_1.STATUS_CODES.OK).json({
                success: true,
                message: 'Messages marked as read',
                data: response,
            });
        }));
        this._messageService = messageService;
    }
}
exports.default = MessageController;
