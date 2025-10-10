import { Router } from 'express';
import { validate } from '../../middleware/verify';

import { ROLE } from '../../constants/role';
import { notificationController } from '../../di/notificationDI';


const router = Router();


//------------------------------------ Notification ----------------------------------

router.get('/', validate(ROLE.USER), (req, res) => notificationController.getNotifications(req, res));
router.post('/', (req, res) => notificationController.createNotification(req, res));
router.patch('/:id/read', validate(ROLE.USER), (req, res) => notificationController.markAsRead(req, res));
router.patch('/mark-all-read', validate(ROLE.USER), (req, res) => notificationController.markAllAsRead(req, res));

router.post("/enrollment", validate(ROLE.USER), (req, res) => notificationController.notifyNewCourseEnrollment(req, res));
router.post("/consultation", validate(ROLE.USER), (req, res) => notificationController.notifyConsultationScheduled(req, res));
router.post("/subscription", (req, res) => notificationController.notifySubscriptionExpiring(req, res));
router.post("/new-course", (req, res) => notificationController.notifyNewCourseAvailable(req, res));



export default router;