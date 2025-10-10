import IExpertController from '../controller/expert/IExpertController';
import ExpertRepository from '../repository/expert/implementation/expertRepository';
import ExpertController from '../controller/expert/implementation/expertController';
import ExpertService from '../service/expert/implementation/expertService';

import SessionRepository from '../repository/expert/implementation/sessionRepository';
import SessionService from '../service/expert/implementation/sessionService';
import SessionController from '../controller/expert/implementation/sessionController';
import ISessionController from '../controller/expert/ISessionController';


const expertRepositoryInstance = new ExpertRepository();
const expertServiceInstance = new ExpertService(expertRepositoryInstance);
const expertControllerInstance: IExpertController = new ExpertController(expertServiceInstance);


const sessionRepository = new SessionRepository();
const sessionService = new SessionService(sessionRepository);
const sessionInstance: ISessionController = new SessionController(sessionService);


export {
    expertControllerInstance,
    sessionInstance,
};