import * as daoValue from '@cm/domain/dao/mng/code/mngGrpCode';
import * as dtoValue from '@cm/domain/dto/mng/code/mngGrpCodeDTO';
import * as daoType from '@cm/types/domain/dao/mng/mngCode';
import * as dtoType from '@cm/types/domain/dto/mng/mngCodeDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';
import { makeDbClause, type whereClauseOptions } from '@cm/utils/db/sqlite/whereClause';

import prisma from '@be/database/prismaClient';
import pkg from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prismaProcess: pkg.Prisma.MngGrpCodeDelegate<DefaultArgs> = prisma.mngGrpCode;

// db field 명과 같게 작성
export const whereConditionSet: whereClauseOptions<dtoType.SearchMngGrpCodeDTO>['operator'] = {
    grp_cd: 'contains',
    grp_cd_nm: 'contains'
};

const whereConditionDefault: whereClauseOptions<dtoType.SearchMngGrpCodeDTO> = {
    operator: whereConditionSet
};

export function dtoToDao(dto: dtoType.MngGrpCodeDTO, exclude?: string[]) {
    return convertUtil.dataCopy(daoValue.mngGrpCode, dto, exclude);
}
export function daoToDto(dao: daoType.MngGrpCode, exclude?: string[]) {
    return convertUtil.dataCopy(dtoValue.mngGrpCodeDTO, dao, exclude);
}

export async function getCount(
    search: dtoType.SearchMngGrpCodeDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngGrpCodeDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    return await prismaProcess.count(whereClause);
}

export async function getList(
    search: dtoType.SearchMngGrpCodeDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngGrpCodeDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    const retListDto: dtoType.MngGrpCodeDTO[] = await prismaProcess
        .findMany(whereClause)
        .then((datas: daoType.MngGrpCode[]) => datas.map((menu: daoType.MngGrpCode) => daoToDto(menu)));
    return retListDto;
}

export async function getDetail(data: dtoType.MngGrpCodeDTO) {
    const whereClause = makeDbClause({ id: data.id });
    const retDto: dtoType.MngGrpCodeDTO | null = await prismaProcess
        .findUnique(whereClause)
        .then((data: daoType.MngGrpCode | null) => (data !== null ? daoToDto(data) : null));
    return retDto;
}

export async function setInsert(data: dtoType.MngGrpCodeDTO) {
    // data 저장
    const dataDao: daoType.MngGrpCode = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const createDao: daoType.MngGrpCodeBase = convertUtil.dataCopy(daoValue.mngGrpCodeBase, dataDao);
    const retDto = await prismaProcess
        .upsert({
            ...whereClause,
            update: dataDao,
            create: createDao
        })
        .then((data: daoType.MngGrpCode) => daoToDto(data));
    return retDto;
}

export async function setUpdate(data: dtoType.MngGrpCodeDTO) {
    // data 수정
    // mlInfo 수정
    return await setInsert(data);
}

export async function setDelete(data: dtoType.MngGrpCodeDTO) {
    // data 삭제
    const dataDao: daoType.MngGrpCode = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngGrpCodeDTO = await prismaProcess
        .delete(whereClause)
        .then((data: daoType.MngGrpCode) => daoToDto(data));
    return retDto;
}
