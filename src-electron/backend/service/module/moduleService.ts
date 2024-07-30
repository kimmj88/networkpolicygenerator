import prisma from '@be/database/prismaClient';
import { Prisma } from '@prisma/client';
import dayjs from 'dayjs';

import * as moduleDAO from '@cm/types/domain/dao/module/moduleDAO';
import * as moduleDTO from '@cm/types/domain/dto/module/moduleDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';


export async function insertData(module: moduleDAO.ModuleDAO) {
    const moduleValueList = module.module_value_list ? module.module_value_list : [];
    return await prisma.module.create({
        data: {
            type_cd: module.type_cd as string,
            title: module.title as string,
            module_value_list: {
                createMany: {
                    data: moduleValueList as Prisma.ModuleValueCreateInput[]
                }
            }
        }
    });
}

export async function updateData(module: moduleDAO.ModuleDAO) {
    const updates = module.module_value_list?.map((item) => {
        return {
            where: {
                id: item.id ? item.id : 0
            },
            update: {
                type_cd: item.type_cd,
                value: item.value
            },
            create: {
                type_cd: item.type_cd,
                value: item.value
            }
        };
    });

    return await prisma.module.update({
        where: {
            id: module.id
        },
        data: {
            title: module.title,
            module_value_list: {
                upsert: updates as Prisma.ModuleValueUpsertWithWhereUniqueWithoutModuleInput[]
            }
        },
        include: {
            module_value_list: true
        }
    });
}

export async function deleteData(module: moduleDAO.ModuleDAO) {
    return await prisma.module.deleteMany({
        where: {
            id: module.id
        }
    });
}

export async function listAll() {
    return await prisma.module.findMany({
        include: {
            module_value_list: true
        }
    });
}

export async function count(data: moduleDTO.CountModuleDTO) {
    const typeCd = data.type_cd ? (data.type_cd.length > 0 ? data.type_cd : undefined) : undefined;
    return await prisma.module.count({
        where: {
            type_cd: typeCd,
            create_time: {
                gte: dayjs(data.create_time_from).utc().toDate(),
                lte: dayjs(data.create_time_to).utc().toDate()
            },
            title: {
                contains: data.title
            }
        }
    });
}

export async function list(data: moduleDTO.SearchModuleDTO) {
    const typeCd = data.type_cd ? (data.type_cd.length > 0 ? data.type_cd : undefined) : undefined;
    const createTimeFrom = data.create_time_from ? dayjs(data.create_time_from).utc().toDate() : undefined;
    const createTimeTo = data.create_time_to ? dayjs(data.create_time_to).utc().toDate() : undefined;

    const sortDatas: {
        [key: string]: string;
    }[] = [];

    data.sort?.split(',').forEach((item) => {
        const splitedItem = item.split(' ');
        if (splitedItem.length > 1) {
            const sortData: {
                [key: string]: string;
            } = {};
            const key = convertUtil.stringCamelToSnake(splitedItem[0]);
            sortData[key] = splitedItem[1];
            sortDatas.push(sortData);
        }
    });

    return await prisma.module.findMany({
        skip: (data.page_per_data ? data.page_per_data : 18) * (data.page ? data.page - 1 : 0),
        take: data.page_per_data,
        where: {
            type_cd: typeCd,
            create_time: {
                gte: createTimeFrom,
                lte: createTimeTo
            },
            title: {
                contains: data.title
            }
        },
        include: {
            module_value_list: true
        },
        orderBy: sortDatas
    });
}

export async function detail(data: moduleDAO.ModuleDAO) {
    return await prisma.module.findUnique({
        where: {
            id: data.id
        },
        include: {
            module_value_list: true
        }
    });
}
