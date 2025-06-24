
import ISessionService from "../ISessionService";
import ISessionRepository from "../../../repository/expert/ISessionRepository";
import { IExpertAvailability } from "../../../model/expert/AvailabilitySchema";



class SessionService implements ISessionService {
    private sessionRepository: ISessionRepository;

    constructor(sessionRepository: ISessionRepository) {
        this.sessionRepository = sessionRepository;
    }

    async getSessions(expertId: string): Promise<IExpertAvailability[] | null> {
        return await this.sessionRepository.getAllByExpertId(expertId);
    }

    async addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.addSession(sessionData);
    }

    async editSession(id: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.updateSession(id, sessionData);
    }

    async deleteSession(id: string): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.deleteSession(id);
    }

}


export default SessionService;