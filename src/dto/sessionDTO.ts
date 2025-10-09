export interface CreateSessionDTO {
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
    status?: 'upcoming' | 'completed' | 'missed';
    bookedAt?: Date;
    startedAt?: Date;
    endedAt?: Date;
}

export interface UpdateSessionDTO {
    meetingLink?: string;
    status?: 'upcoming' | 'completed' | 'missed';
    startedAt?: Date;
    endedAt?: Date;
}

export interface SessionResponseDTO {
    id: string;
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: Date;
    startedAt?: Date;
    endedAt?: Date;
    createdAt: Date;
}