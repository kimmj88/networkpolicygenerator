import prisma from '@be/database/prismaClient';
import dayjs from 'dayjs';

import * as variableDAO from '@cm/types/domain/dao/variable/variableDAO';
import * as vriableDTO from '@cm/types/domain/dto/variable/variableDTO';

export async function countVariable(variable: vriableDTO.VariableSearchDTO) {
    const filters: any = {
        create_time: {
            gte: variable.create_time_from != undefined ? dayjs(variable.create_time_from).utc().toDate() : undefined,
            lte: variable.create_time_to != undefined ? dayjs(variable.create_time_to).utc().toDate() : undefined
        }
    };

    return await prisma.variable.count({
        where: filters
    });
}

export async function listVariable(variable: vriableDTO.VariableSearchDTO) {
    const filters: any = {
        type_cd: variable.type_cd != '' ? variable.type_cd : undefined,
        key: {
            contains: variable.key != '' ? variable.key : undefined
        },
        value: {
            contains: variable.value != '' ? variable.value : undefined
        },
        create_time: {
            gte: variable.create_time_from != undefined ? dayjs(variable.create_time_from).utc().toDate() : undefined,
            lte: variable.create_time_to != undefined ? dayjs(variable.create_time_to).utc().toDate() : undefined
        }
    };

    return await prisma.variable.findMany({
        where: filters
    });
}

export async function allVariable() {
    const variables = await prisma.variable.findMany();
    return variables;
}

export async function detailVariable(variable: vriableDTO.VariableSearchDTO) {
    return await prisma.variable.findMany({
        where: {
            id: variable.id
        }
    });
}

export async function detailByKey(key: string) {
    return await prisma.variable.findUnique({
        where: {
            key: key
        }
    });
}

export async function insertVariable(variable: variableDAO.VariableInsertDAO) {
    return await prisma.variable.create({
        data: {
            type_cd: variable.type_cd,
            key: variable.key,
            value: variable.value
        }
    });
}

export async function updateVariable(variable: variableDAO.VariableUpdateDAO) {
    return await prisma.variable.update({
        where: {
            id: variable.id
        },
        data: {
            type_cd: variable.type_cd,
            key: variable.key,
            value: variable.value
        }
    });
}

export async function deleteVariable(variable: vriableDTO.VariableDTO) {
    return await prisma.variable.delete({
        where: { id: variable.id }
    });
}
