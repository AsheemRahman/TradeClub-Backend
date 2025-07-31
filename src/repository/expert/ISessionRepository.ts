import mongoose from "mongoose";
import { IExpertAvailability } from "../../model/expert/AvailabilitySchema";
import { ISession } from "../../model/expert/sessionSchema";
import { IAnalyticsResult } from "../../types/IExpert";


interface ISessionRepository {
    getAllByExpertId(expertId: string): Promise<IExpertAvailability[] | null>;
    addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability>;
    updateSession(id: string, updatedData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null>;
    deleteSession(id: string): Promise<IExpertAvailability | null>;

    countSessionsByExpert(expertId: string): Promise<number>;
    countCompletedSessions(expertId: string): Promise<number>;
    getDistinctStudents(expertId: string): Promise<mongoose.Types.ObjectId[]>;
    getRecentStudents(expertId: string, lastMonth: Date): Promise<mongoose.Types.ObjectId[]>;
    getUpcomingSessions(expertId: string): Promise<number>;

    getSessionAnalytics(expertId: string, startDate: Date): Promise<IAnalyticsResult[]>;
}


export default ISessionRepository;