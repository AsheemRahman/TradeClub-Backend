import { IExpertAvailability } from "../../model/expert/AvailabilitySchema";


interface ISessionRepository {
    getAllByExpertId(expertId: string): Promise<IExpertAvailability[] | null>;
    addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability>
    updateSession(id: string, updatedData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>
    deleteSession(id: string): Promise<IExpertAvailability | null>
}


export default ISessionRepository;