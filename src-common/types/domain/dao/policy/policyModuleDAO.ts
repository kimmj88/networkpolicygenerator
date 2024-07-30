import { Prisma } from '@prisma/client';

export interface PolicyModuleSearchDAO {
    policy_id: number;
    module_id: number;
}

export interface PolicyModuleInsertDAO {
    policy_id: number;
    module_id: number;
}

export interface PolicyModuleUpdateDAO extends Prisma.PolicyModuleUpdateInput {
    module_id: number;
}
