
import ISessionService from "../ISessionService";
import ISessionRepository from "../../../repository/expert/ISessionRepository";
import { IExpertAvailability } from "../../../model/expert/AvailabilitySchema";
import { IDashboardStats, IGetSessionsResponse, ISessionAnalytics, ISessionFilters } from "../../../types/IExpert";



class SessionService implements ISessionService {
    private _sessionRepository: ISessionRepository;

    constructor(sessionRepository: ISessionRepository) {
        this._sessionRepository = sessionRepository;
    };

    async getSlots(expertId: string): Promise<IExpertAvailability[] | null> {
        return await this._sessionRepository.getAllByExpertId(expertId);
    };

    async addSlot(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this._sessionRepository.addSession(sessionData);
    };

    async editSlot(slotId: string, sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await this._sessionRepository.updateSession(slotId, sessionData);
    };

    async deleteSlot(slotId: string): Promise<IExpertAvailability | null> {
        return await this._sessionRepository.deleteSession(slotId);
    };

    async getDashboardStats(expertId: string): Promise<IDashboardStats> {
        const lastMonth = new Date();
        lastMonth.setDate(lastMonth.getDate() - 30);
        const [distinctStudents, totalSessions, upcomingSessions, completedSessions, recentStudents] = await Promise.all([
            this._sessionRepository.getDistinctStudents(expertId),
            this._sessionRepository.countSessionsByExpert(expertId),
            this._sessionRepository.getUpcomingSessions(expertId),
            this._sessionRepository.countCompletedSessions(expertId),
            this._sessionRepository.getRecentStudents(expertId, lastMonth)
        ]);
        const totalStudents = distinctStudents.length;
        const completionRate = totalSessions > 0 ? Math.round((completedSessions / totalSessions) * 100) : 0;
        const monthlyGrowth = totalStudents > 0 ? Math.round(((recentStudents?.length ?? 0) / totalStudents) * 100) : 0;
        return {
            totalStudents,
            totalSessions,
            upcomingSessions,
            completionRate,
            monthlyGrowth,
        };
    }


    async getSessionAnalytics(expertId: string, period: '7d' | '30d' | '90d'): Promise<ISessionAnalytics[]> {
        const days = period === '7d' ? 7 : period === '90d' ? 90 : 30;
        const startDate = new Date();
        startDate.setDate(startDate.getDate() - days);
        const analytics = await this._sessionRepository.getSessionAnalytics(expertId, startDate);
        return analytics.map((data) => ({
            date: data._id as string,
            sessions: data.sessions,
            students: data.students.length
        }));
    }

    async getSessions(expertId: string, page: number, limit: number, filters: ISessionFilters): Promise<IGetSessionsResponse> {
        const { status, date, startDate, endDate, search } = filters;
        const query: any = { expertId };
        if (status && status !== 'all') query.status = status;
        if (date) {
            const startOfDay = new Date(date);
            const endOfDay = new Date(startOfDay);
            endOfDay.setDate(endOfDay.getDate() + 1);
            query['availabilityId.startTime'] = { $gte: startOfDay, $lt: endOfDay };
        } else if (startDate && endDate) {
            query['availabilityId.startTime'] = { $gte: new Date(startDate), $lte: new Date(endDate) };
        }
        if (search) {
            query.$or = [
                { 'userId.fullName': { $regex: search, $options: 'i' } },
                { 'userId.email': { $regex: search, $options: 'i' } }
            ];
        }
        const sessions = await this._sessionRepository.findSessions(query, page, limit);
        const total = await this._sessionRepository.countSessions(query);
        return {
            sessions,
            pagination: {
                currentPage: page,
                totalPages: Math.ceil(total / limit),
                totalItems: total,
                itemsPerPage: limit,
                hasNextPage: page * limit < total,
                hasPrevPage: page > 1,
            },
        };
    }
}


export default SessionService;