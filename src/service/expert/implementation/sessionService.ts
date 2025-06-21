
import ISessionService from "../ISessionService";
import ISessionRepository from "../../../repository/expert/ISessionRepository";



class SessionService implements ISessionService {
    private sessionRepository: ISessionRepository;

    constructor(sessionRepository: ISessionRepository) {
        this.sessionRepository = sessionRepository;
    }


}


export default SessionService;