"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMapper = void 0;
class EntityMapper {
    static toSubscriptionPlanResponseDTO(plan) {
        return {
            id: plan._id.toString(),
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: plan.features || [],
            accessLevel: {
                expertCallsPerMonth: plan.accessLevel?.expertCallsPerMonth || 0,
                videoAccess: plan.accessLevel?.videoAccess || false,
                chatSupport: plan.accessLevel?.chatSupport || false,
            },
            isActive: plan.isActive ?? true,
            createdAt: plan.createdAt,
            updatedAt: plan.updatedAt,
        };
    }
    static toSubscriptionPlanEntity(dto) {
        return {
            name: dto.name,
            price: dto.price,
            duration: dto.duration,
            features: dto.features,
            accessLevel: dto.accessLevel,
            isActive: dto.isActive,
        };
    }
}
exports.EntityMapper = EntityMapper;
//# sourceMappingURL=subscriptionMapper.js.map