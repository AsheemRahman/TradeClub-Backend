export interface CreateCouponDTO {
    code: string;
    description: string;
    discountType: 'percentage' | 'flat';
    discountValue: number;
    minPurchaseAmount?: number;
    usageLimit?: number;
    expiresAt: Date;
    isActive: boolean;
    target: 'all' | 'specific';
    applicableToUsers: string[];
    usedCount?: number;
}

export interface GetUsersParams {
    search?: string;
    status?: string;
    sort?: string;
    page: number;
    limit: number;
}