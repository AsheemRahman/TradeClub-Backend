import { ISession } from "../model/expert/sessionSchema";


export type IUserType = {
    fullName: string;
    email: string;
    password?: string;
    phoneNumber?: string;
}


export interface IOrderInput {
    userId: string;
    itemId: string;
    type: "Course" | "SubscriptionPlan";
    title: string;
    amount: number;
    currency: string;
    stripeSessionId: string;
    paymentIntentId: string;
    paymentStatus: "paid" | string;
}

export interface CreateSessionDTO {
    userId: string;
    expertId: string;
    availabilityId: string;
    meetingLink?: string;
}

export interface ISessionsResponse {
    sessions: ISession[];
    total: number;
    page: number;
    limit: number;
}