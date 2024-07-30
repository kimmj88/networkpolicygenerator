import prisma from '@be/database/prismaClient';
import * as moduleValueDAO from '@cm/types/domain/dao/module/moduleValueDAO';
import * as moduleValueDTO from '@cm/types/domain/dto/module/moduleValueDTO';

export async function insertData(moduleValue: moduleValueDAO.ModuleValueDAO) {
    return await prisma.moduleValue.create({
        data: {
            type_cd: moduleValue.type_cd as string,
            value: moduleValue.value as string,
            module: {
                connect: {
                    id: moduleValue.module_id
                }
            }
        }
    });
}

export async function updateData(moduleValue: moduleValueDAO.ModuleValueDAO) {
    return await prisma.moduleValue.update({
        where: {
            id: moduleValue.id
        },
        data: {
            value: moduleValue.value,
            module: {
                connect: {
                    id: moduleValue.module_id
                }
            }
        }
    });
}

export async function deleteData(moduleValue: moduleValueDAO.ModuleValueDAO) {
    return await prisma.moduleValue.delete({
        where: {
            id: moduleValue.id
        }
    });
}

export async function deleteManyData(moduleValue: moduleValueDTO.DeleteManyModuleValueDTO) {
    return await prisma.moduleValue.deleteMany({
        where: {
            id: {
                in: moduleValue.ids
            }
        }
    });
}

export async function listAll() {
    return await prisma.moduleValue.findMany();
}

export async function list(moduleValue: moduleValueDTO.GetModuleValueDTO) {
    return await prisma.moduleValue.findMany({
        where: {
            module_id: moduleValue.module_id
        }
    });
}
