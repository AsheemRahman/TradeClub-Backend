import { ISession } from "../model/expert/sessionSchema";

export type ExpertFormData = {
    email?: string;
    phoneNumber: string;
    profilePicture: File | null;
    DOB: string;
    state: string;
    country: string;
    experience_level: string;
    year_of_experience: string;
    markets_Traded: string;
    trading_style: string;
    proof_of_experience: File | null;
    Introduction_video: File | null;
    Government_Id: File | null;
    selfie_Id: File | null;
}

export interface IDashboardStats {
    totalStudents: number;
    totalSessions: number;
    averageRating?: number;
    pendingMessages?: number;
    upcomingSessions: number;
    completionRate: number;
    monthlyGrowth: number;
}

export interface ISessionAnalytics {
    date: string;
    sessions: number;
    students: number;
}

export interface IAnalyticsResult {
    _id: string;
    sessions: number;
    students: string[];
}

export interface IPagination {
    currentPage: number;
    totalPages: number;
    totalItems: number;
    itemsPerPage: number;
    hasNextPage: boolean;
    hasPrevPage: boolean;
}

export interface ISessionFilters {
    status?: string;
    date?: string;
    startDate?: string;
    endDate?: string;
    search?: string;
}

export interface IGetSessionsResponse {
    sessions: ISession[];
    pagination: IPagination;
}