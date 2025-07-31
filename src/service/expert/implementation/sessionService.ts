
import ISessionService from "../ISessionService";
import ISessionRepository from "../../../repository/expert/ISessionRepository";
import { IExpertAvailability } from "../../../model/expert/AvailabilitySchema";
import { IDashboardStats, ISessionAnalytics } from "../../../types/IExpert";



class SessionService implements ISessionService {
    private sessionRepository: ISessionRepository;

    constructor(sessionRepository: ISessionRepository) {
        this.sessionRepository = sessionRepository;
    };

    async getSessions(expertId: string): Promise<IExpertAvailability[] | null> {
        return await this.sessionRepository.getAllByExpertId(expertId);
    };

    async addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.addSession(sessionData);
    };

    async editSession(id: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.updateSession(id, sessionData);
    };

    async deleteSession(id: string): Promise<IExpertAvailability | null> {
        return await this.sessionRepository.deleteSession(id);
    };

    async getDashboardStats(expertId: string): Promise<IDashboardStats> {
        const totalStudents = (await this.sessionRepository.getDistinctStudents(expertId)).length;
        const totalSessions = await this.sessionRepository.countSessionsByExpert(expertId);
        // const averageRating = await this.sessionRepository.getAverageRating(expertId);
        // const pendingMessages = await this.sessionRepository.countPendingMessages(expertId);
        const upcomingSessions = await this.sessionRepository.getUpcomingSessions(expertId);
        const completedSessions = await this.sessionRepository.countCompletedSessions(expertId);
        const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        const recentStudents = (await this.sessionRepository.getRecentStudents(expertId, lastMonth))?.length;
        const monthlyGrowth = totalStudents > 0 ? Math.round((recentStudents / totalStudents) * 100) : 0;
        return {
            totalStudents,
            totalSessions,
            // averageRating,
            // pendingMessages,
            upcomingSessions,
            completionRate,
            monthlyGrowth,
        };
    }

    async getSessionAnalytics(expertId: string, period: '7d' | '30d' | '90d'): Promise<ISessionAnalytics[]> {
        const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const analytics = await this.sessionRepository.getSessionAnalytics(expertId, startDate);
        return analytics.map((data) => ({
            date: data._id as string,
            sessions: data.sessions,
            students: data.students.length
        }));
    }
}


export default SessionService;