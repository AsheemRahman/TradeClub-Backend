import ISessionRepository from "../ISessionRepository";
import { BaseRepository } from "../../base/implementation/BaseRepository";
import { ExpertAvailability, IExpertAvailability, } from "../../../model/expert/AvailabilitySchema";


class SessionRepository extends BaseRepository<IExpertAvailability> implements ISessionRepository {
    constructor() {
        super(ExpertAvailability)
    }

    async getAllByExpertId(expertId: string): Promise<IExpertAvailability[]> {
        return await ExpertAvailability.find({ expertId });
    }

    async addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability> {
        const session = new ExpertAvailability(sessionData);
        return await session.save();
    }

    async updateSession(id: string, updatedData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await ExpertAvailability.findByIdAndUpdate(id, updatedData, { new: true });
    }

    async deleteSession(id: string): Promise<IExpertAvailability | null> {
        return await ExpertAvailability.findByIdAndDelete(id);
    }
}

export default SessionRepository;