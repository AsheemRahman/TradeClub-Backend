import { Router } from 'express';
import { validate } from '../../middleware/verify';

import { ROLE } from '../../constants/role';
import { notificationController } from '../../di/notificationDI';


const router = Router();


//------------------------------------ Notification ----------------------------------

router.get('/', validate(ROLE.USER),  notificationController.getNotifications.bind(notificationController));
router.post('/',  notificationController.createNotification.bind(notificationController));
router.patch('/:id/read', validate(ROLE.USER),  notificationController.markAsRead.bind(notificationController));
router.patch('/mark-all-read', validate(ROLE.USER),  notificationController.markAllAsRead.bind(notificationController));

router.post("/enrollment", validate(ROLE.USER),  notificationController.notifyNewCourseEnrollment.bind(notificationController));
router.post("/consultation", validate(ROLE.USER),  notificationController.notifyConsultationScheduled.bind(notificationController));
router.post("/subscription",  notificationController.notifySubscriptionExpiring.bind(notificationController));
router.post("/new-course",  notificationController.notifyNewCourseAvailable.bind(notificationController));



export default router;