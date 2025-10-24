export type UserMinimal = {
    _id: string;
    fullName: string;
    profilePicture?: string;
    role: "User" | "Expert";
    lastMessage?: string;
    unreadCount?: number;
    updatedAt?: string;
};


export interface sessionType {
    id: string;
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
    status: 'upcoming' | 'completed' | 'missed';
    bookedAt: Date;
    startedAt?: Date;
    endedAt?: Date;
    createdAt?: Date;
    updatedAt?: Date;
}