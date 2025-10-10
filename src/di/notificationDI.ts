import NotificationRepository from '../repository/user/implementation/notificationRepository';
import NotificationService from '../service/user/implementation/notificationService';
import userRepository from '../repository/user/implementation/userRepository';
import NotificationController from '../controller/user/implementation/notificationController';
import INotificationController from '../controller/user/INotificationController';


const UserRepository = new userRepository()
const notificationRepository = new NotificationRepository();
const notificationService = new NotificationService(notificationRepository, UserRepository);
const notificationController: INotificationController = new NotificationController(notificationService);


export {
    notificationController,
};