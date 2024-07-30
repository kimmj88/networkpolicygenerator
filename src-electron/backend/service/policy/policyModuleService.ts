import prisma from '@be/database/prismaClient';
import * as policyModuleInsertDAO from '@cm/types/domain/dao/policy/policyModuleDAO';

export async function insertPolicyModule(policyModule: policyModuleInsertDAO.PolicyModuleInsertDAO) {
    return await prisma.policyModule.create({
        data: policyModule
    });
}
