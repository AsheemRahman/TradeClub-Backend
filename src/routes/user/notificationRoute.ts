import { Router } from 'express';
import { validate } from '../../middleware/Verify';

import NotificationRepository from '../../repository/user/implementation/notificationRepository';
import NotificationService from '../../service/user/implementation/notificationService';
import userRepository from '../../repository/user/implementation/userRepository';
import NotificationController from '../../controller/user/implementation/notificationController';
import INotificationController from '../../controller/user/INotificationController';

const router = Router();

const UserRepository = new userRepository()
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, UserRepository);
const notificationController: INotificationController = new NotificationController(notificationService);


//------------------------------------ Notification ----------------------------------

router.get('/', validate("user"), (req, res) => notificationController.getNotifications(req, res));
router.post('/', validate("user"), (req, res) => notificationController.createNotification(req, res));
router.patch('/:id/read', validate("user"), (req, res) => notificationController.markAsRead(req, res));
router.patch('/mark-all-read', validate("user"), (req, res) => notificationController.markAllAsRead(req, res));


export default router;