

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