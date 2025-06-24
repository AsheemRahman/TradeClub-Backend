import { IExpertAvailability } from "../../model/expert/AvailabilitySchema";


interface ISessionService {
    getSessions(expertId: string): Promise<IExpertAvailability[] | null>;
    addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>
    editSession(id: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>
    deleteSession(id: string): Promise<IExpertAvailability | null>
}

export default ISessionService;