export interface CreateSubscriptionPlanDTO {
    name: string;
    price: number;
    duration: number;
    features?: string[];
    accessLevel?: {
        expertCallsPerMonth?: number;
        videoAccess?: boolean;
        chatSupport?: boolean;
    };
    isActive?: boolean;
}

export interface UpdateSubscriptionPlanDTO {
    name?: string;
    price?: number;
    duration?: number;
    features?: string[];
    accessLevel?: {
        expertCallsPerMonth?: number;
        videoAccess?: boolean;
        chatSupport?: boolean;
    };
    isActive?: boolean;
}

export interface SubscriptionPlanResponseDTO {
    id: string;
    name: string;
    price: number;
    duration: number;
    features: string[];
    accessLevel: {
        expertCallsPerMonth: number;
        videoAccess: boolean;
        chatSupport: boolean;
    };
    isActive: boolean;
    createdAt: Date;
    updatedAt: Date;
}