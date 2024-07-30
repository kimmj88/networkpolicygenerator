import prisma from '@be/database/prismaClient';
import dayjs from 'dayjs';

import * as policyDAO from '@cm/types/domain/dao/policy/policyDAO';
import * as policyDTO from '@cm/types/domain/dto/policy/policyDTO';


export async function countPolicy(policy: policyDTO.PolicySearchDTO) {
    const filters: any = {
        title: {
            contains: policy.title
        },
        create_time: {
            gte: policy.create_time_from != undefined ? dayjs(policy.create_time_from).utc().toDate() : undefined,
            lte: policy.create_time_to != undefined ? dayjs(policy.create_time_to).utc().toDate() : undefined
        }
    };

    return await prisma.policy.count({
        where: filters
    });
}

export async function listPolicy(policy: policyDTO.PolicySearchDTO) {
    try {
        const policiesWithModules = await prisma.policy.findMany({
            where: {
                title: {
                    contains: policy.title
                },
                create_time: {
                    gte:
                        policy.create_time_from != undefined
                            ? dayjs(policy.create_time_from).utc().toDate()
                            : undefined,
                    lte: policy.create_time_to != undefined ? dayjs(policy.create_time_to).utc().toDate() : undefined
                }
            },
            include: {
                _count: true,
                policyModules: {
                    include: {
                        module: { include: { module_value_list: true } }
                    }
                }
            }
        });

        const transformedPolicies = policiesWithModules.map((policy) => {
            const modules = policy.policyModules.map((pm) => pm.module);
            return {
                ...policy,
                policyModules: modules,
                count: policy._count.policyModules
            };
        });

        return transformedPolicies;
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function allPolicy() {
    const policies = await prisma.policy.findMany({ include: { policyModules: true } });
    return policies;
}

export async function detailPolicy(policy: policyDTO.PolicySearchDTO) {
    try {
        const policiesWithModules = await prisma.policy.findMany({
            where: { id: policy.id },
            include: {
                policyModules: {
                    include: {
                        module: true
                    }
                }
            }
        });

        const transformedPolicies = policiesWithModules
            .map((policy) => {
                const modules = policy.policyModules.map((pm) => pm.module);
                return {
                    ...policy,
                    policyModules: modules
                };
            })
            .map(({ policyModules, ...rest }) => rest);

        console.log(JSON.stringify(transformedPolicies, null, 2));
        return transformedPolicies;
    } catch (error) {
        console.error(error);
    } finally {
        await prisma.$disconnect();
    }
}

export async function createPolicy(policy: policyDAO.PolicyInsertDAO) {
    return await prisma.policy.create({
        data: policy
    });
}

export async function updatePolicy(policy: policyDAO.PolicyUpdateDAO) {
    const resultPolicy = await prisma.policy.update({
        where: {
            id: policy.id
        },
        data: {
            title: policy.title
        }
    });

    let upsertDataList: any[] = [];
    for (const module of policy.modules) {
        const upsertData = await prisma.policyModule.upsert({
            where: {
                policy_id_module_id: {
                    policy_id: resultPolicy.id,
                    module_id: module.id!
                }
            },
            update: {
                module_id: module.id!
            },
            create: {
                policy_id: resultPolicy.id,
                module_id: module.id!
            }
        });
        upsertDataList.push(upsertData);
    }

    if (upsertDataList.length > 0) {
        await prisma.policyModule.deleteMany({
            where: {
                policy_id: resultPolicy.id,
                module_id: {
                    notIn: upsertDataList.map((item) => item.module_id)
                }
            }
        });
    }

    return resultPolicy;
}

export async function deletePolicy(policy: policyDTO.PolicyDTO) {
    return await prisma.policy.delete({
        where: { id: policy.id }
    });
}
