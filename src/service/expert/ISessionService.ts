import { IExpertAvailability } from "../../model/expert/AvailabilitySchema";
import { IDashboardStats, ISessionAnalytics } from "../../types/IExpert";


interface ISessionService {
    getSessions(expertId: string): Promise<IExpertAvailability[] | null>;
    addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>;
    editSession(id: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>;
    deleteSession(id: string): Promise<IExpertAvailability | null>;

    getDashboardStats(expertId: string): Promise<IDashboardStats>;
    getSessionAnalytics(expertId: string, period: '7d' | '30d' | '90d'): Promise<ISessionAnalytics[]>;
}

export default ISessionService;