import { IExpertAvailability } from "../../model/expert/AvailabilitySchema";
import { IDashboardStats, IGetSessionsResponse, ISessionAnalytics, ISessionFilters } from "../../types/IExpert";


interface ISessionService {
    getSlots(expertId: string): Promise<IExpertAvailability[] | null>;
    addSlot(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>;
    editSlot(id: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>;
    deleteSlot(id: string): Promise<IExpertAvailability | null>;

    getDashboardStats(expertId: string): Promise<IDashboardStats>;
    getSessionAnalytics(expertId: string, period: '7d' | '30d' | '90d'): Promise<ISessionAnalytics[]>;

    getSessions( expertId: string, page: number, limit: number, filters: ISessionFilters): Promise<IGetSessionsResponse>;
}

export default ISessionService;