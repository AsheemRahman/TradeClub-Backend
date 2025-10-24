import ISessionRepository from "../ISessionRepository";
import { BaseRepository } from "../../base/implementation/baseRepository";
import { ExpertAvailability, IExpertAvailability, } from "../../../model/expert/availabilitySchema";
import mongoose, { FilterQuery } from "mongoose";
import { ISession, Session } from "../../../model/expert/sessionSchema";
import { IAnalyticsResult } from "../../../types/IExpert";


class SessionRepository extends BaseRepository<ISession> implements ISessionRepository {
    constructor() {
        super(Session)
    }

    async getAllByExpertId(expertId: string): Promise<IExpertAvailability[]> {
        return await ExpertAvailability.find({ expertId });
    }

    async addSession(sessionData: Partial<IExpertAvailability>): Promise<IExpertAvailability> {
        const session = new ExpertAvailability(sessionData);
        return await session.save();
    }

    async updateSession(sessionId: string, updatedData: Partial<IExpertAvailability>): Promise<IExpertAvailability | null> {
        return await ExpertAvailability.findByIdAndUpdate(sessionId, updatedData, { new: true });
    }

    async deleteSession(sessionId: string): Promise<IExpertAvailability | null> {
        return await ExpertAvailability.findByIdAndDelete(sessionId);
    }

    //-------------------------------- Dashboard ---------------------------------

    async countSessionsByExpert(expertId: string): Promise<number> {
        return this.model.countDocuments({ expertId: new mongoose.Types.ObjectId(expertId) });
    }

    async countCompletedSessions(expertId: string): Promise<number> {
        return this.model.countDocuments({ expertId: expertId, status: 'completed' });
    }

    async getDistinctStudents(expertId: string): Promise<mongoose.Types.ObjectId[]> {
        return this.model.distinct('userId', { expertId });
    }

    async getRecentStudents(expertId: string, lastMonth: Date): Promise<mongoose.Types.ObjectId[]> {
        return this.model.distinct('userId', { expertId: expertId, date: { $gte: lastMonth } });
    }

    async getUpcomingSessions(expertId: string): Promise<number> {
        return this.model.countDocuments({ expertId: expertId, status: 'upcoming' });
    }

    async getSessionAnalytics(expertId: string, startDate: Date): Promise<IAnalyticsResult[]> {
        return this.model.aggregate<IAnalyticsResult>([
            { $match: { expertId: new mongoose.Types.ObjectId(expertId), bookedAt: { $gte: startDate } } },
            {
                $group: {
                    _id: { $dateToString: { format: '%Y-%m-%d', date: '$bookedAt' } },
                    sessions: { $sum: 1 },
                    students: { $addToSet: '$userId' }
                }
            }, { $sort: { _id: 1 } }
        ]);
    }

    async findSessions(query: FilterQuery<any>, page: number, limit: number): Promise<ISession[]> {
        return Session.find(query)
            .populate('userId', 'fullName email profilePicture')
            .populate('expertId', 'fullName')
            .populate('availabilityId', 'startTime endTime date')
            .sort({ 'availabilityId.startTime': -1 })
            .limit(limit)
            .skip((page - 1) * limit);
    }

    async countSessions(query: FilterQuery<any>): Promise<number> {
        return this.model.countDocuments(query);
    }
}

export default SessionRepository;