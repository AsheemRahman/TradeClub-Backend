import { Router } from 'express';
import { validate } from '../../middleware/Verify';

import NotificationRepository from '../../repository/user/implementation/notificationRepository';
import NotificationService from '../../service/user/implementation/notificationService';
import userRepository from '../../repository/user/implementation/userRepository';
import NotificationController from '../../controller/user/implementation/notificationController';
import INotificationController from '../../controller/user/INotificationController';
import { ROLE } from '../../constants/role';

const router = Router();

const UserRepository = new userRepository()
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, UserRepository);
const notificationController: INotificationController = new NotificationController(notificationService);


//------------------------------------ Notification ----------------------------------

router.get('/', validate(ROLE.USER), (req, res) => notificationController.getNotifications(req, res));
router.post('/', (req, res) => notificationController.createNotification(req, res));
router.patch('/:id/read', validate(ROLE.USER), (req, res) => notificationController.markAsRead(req, res));
router.patch('/mark-all-read', validate(ROLE.USER), (req, res) => notificationController.markAllAsRead(req, res));

router.post("/enrollment", validate(ROLE.USER), (req, res) => notificationController.notifyNewCourseEnrollment(req, res));
router.post("/consultation", (req, res) => notificationController.notifyConsultationScheduled(req, res));
router.post("/subscription", (req, res) => notificationController.notifySubscriptionExpiring(req, res));
router.post("/new-course", (req, res) => notificationController.notifyNewCourseAvailable(req, res));


export default router;