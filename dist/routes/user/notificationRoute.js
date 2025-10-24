"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const verify_1 = require("../../middleware/verify");
const role_1 = require("../../constants/role");
const notificationDI_1 = require("../../di/notificationDI");
const router = (0, express_1.Router)();
//------------------------------------ Notification ----------------------------------
router.get('/', (0, verify_1.validate)(role_1.ROLE.USER), notificationDI_1.notificationController.getNotifications.bind(notificationDI_1.notificationController));
router.post('/', notificationDI_1.notificationController.createNotification.bind(notificationDI_1.notificationController));
router.patch('/:id/read', (0, verify_1.validate)(role_1.ROLE.USER), notificationDI_1.notificationController.markAsRead.bind(notificationDI_1.notificationController));
router.patch('/mark-all-read', (0, verify_1.validate)(role_1.ROLE.USER), notificationDI_1.notificationController.markAllAsRead.bind(notificationDI_1.notificationController));
router.post("/enrollment", (0, verify_1.validate)(role_1.ROLE.USER), notificationDI_1.notificationController.notifyNewCourseEnrollment.bind(notificationDI_1.notificationController));
router.post("/consultation", (0, verify_1.validate)(role_1.ROLE.USER), notificationDI_1.notificationController.notifyConsultationScheduled.bind(notificationDI_1.notificationController));
router.post("/subscription", notificationDI_1.notificationController.notifySubscriptionExpiring.bind(notificationDI_1.notificationController));
router.post("/new-course", notificationDI_1.notificationController.notifyNewCourseAvailable.bind(notificationDI_1.notificationController));
exports.default = router;
