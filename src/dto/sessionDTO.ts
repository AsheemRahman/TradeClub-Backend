import { Types } from "mongoose";

export interface CreateSessionDTO {
    userId: Types.ObjectId;
    expertId: Types.ObjectId;
    availabilityId: Types.ObjectId;
    meetingLink?: string;
    status?: 'upcoming' | 'completed' | 'missed';
    bookedAt?: Date;
    startTime?: string;
    endedTime?: string;
}

export interface UpdateSessionDTO {
    meetingLink?: string;
    status?: 'upcoming' | 'completed' | 'missed';
    startTime?: string;
    endedTime?: string;
}

export interface SessionResponseDTO {
    id: string;
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: Date;
    startTime?: string;
    createdAt: Date;
}