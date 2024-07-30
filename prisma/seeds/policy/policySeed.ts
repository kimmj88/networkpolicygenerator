import { PrismaClient, Ruleset } from '@prisma/client';
const prisma = new PrismaClient();
import { PolicyInsertDAO, PolicyModulesInsertDAO } from '@cm/types/domain/dao/policy/policyDAO';
import { PolicyModuleInsertDAO } from '@cm/types/domain/dao/policy/policyModuleDAO';
import * as policyModuleService from '@be/service/policy/policyModuleService';

const initPolicy = {
    title: 'Lua1'
} as PolicyInsertDAO;

async function seedPolicy() {
    const policy = await prisma.policy.create({ data: initPolicy });

    if (policy) {
        const modules = await prisma.module.findMany();
        for (const module of modules) {
            const policyModule: PolicyModuleInsertDAO = {
                policy_id: policy.id,
                module_id: module.id as number
            };
            await policyModuleService.insertPolicyModule(policyModule);
        }
    }
}

export default seedPolicy;
