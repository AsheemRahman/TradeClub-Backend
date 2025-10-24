import { ISubscriptionPlan } from "../model/admin/subscriptionSchema";
import { SubscriptionPlanResponseDTO, CreateSubscriptionPlanDTO, UpdateSubscriptionPlanDTO } from "../dto/subscriptionDTO";


export class EntityMapper {
    static toSubscriptionPlanResponseDTO(plan: any): SubscriptionPlanResponseDTO {
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
            createdAt: plan.createdAt!,
            updatedAt: plan.updatedAt!,
        };
    }

    static toSubscriptionPlanEntity(dto: CreateSubscriptionPlanDTO | UpdateSubscriptionPlanDTO): Partial<ISubscriptionPlan> {
        return {
            name: dto.name,
            price: dto.price,
            duration: dto.duration,
            features: dto.features,
            accessLevel: dto.accessLevel,
            isActive: (dto as UpdateSubscriptionPlanDTO).isActive,
        };
    }

}
