"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.EntityMapper = void 0;
class EntityMapper {
    static toSubscriptionPlanResponseDTO(plan) {
        var _a, _b, _c, _d;
        return {
            id: plan._id.toString(),
            name: plan.name,
            price: plan.price,
            duration: plan.duration,
            features: plan.features || [],
            accessLevel: {
                expertCallsPerMonth: ((_a = plan.accessLevel) === null || _a === void 0 ? void 0 : _a.expertCallsPerMonth) || 0,
                videoAccess: ((_b = plan.accessLevel) === null || _b === void 0 ? void 0 : _b.videoAccess) || false,
                chatSupport: ((_c = plan.accessLevel) === null || _c === void 0 ? void 0 : _c.chatSupport) || false,
            },
            isActive: (_d = plan.isActive) !== null && _d !== void 0 ? _d : true,
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
