import * as mngCodeMlService from '@be/service/mng/code/mngCodeMlService';
import * as daoValue from '@cm/domain/dao/mng/code/mngCode';
import * as dtoValue from '@cm/domain/dto/mng/code/mngCodeDTO';
import * as mlDtoValue from '@cm/domain/dto/mng/code/mngCodeMlDTO';
import * as daoType from '@cm/types/domain/dao/mng/mngCode';
import * as dtoType from '@cm/types/domain/dto/mng/mngCodeDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';
import { makeDbClause, type whereClauseOptions } from '@cm/utils/db/sqlite/whereClause';

import prisma from '@be/database/prismaClient';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prismaProcess: Prisma.MngCodeDelegate<DefaultArgs> = prisma.mngCode;

// db field 명과 같게 작성
export const whereConditionSet: whereClauseOptions<dtoType.SearchMngCodeDTO>['operator'] = {
    grp_cd: 'contains',
    cd: 'contains',
    cd_nm: 'contains'
};

const whereConditionDefault: whereClauseOptions<dtoType.SearchMngCodeDTO> = {
    operator: whereConditionSet
};

export function dtoToDao(dto: dtoType.MngCodeDTO, exclude?: string[]) {
    return convertUtil.dataCopy(daoValue.mngCode, dto, exclude);
}
export function daoToDto(dao: daoType.MngCode, exclude?: string[]) {
    return convertUtil.dataCopy(dtoValue.mngCodeDTO, dao, exclude);
}

export async function getCount(
    search: dtoType.SearchMngCodeDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngCodeDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    return await prismaProcess.count(whereClause);
}

export async function getAll() {
    return await prismaProcess.findMany();
}

export async function getList(
    search: dtoType.SearchMngCodeDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngCodeDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    const mlList: dtoType.MngCodeMlDTO[] = await mngCodeMlService.getList({});
    const retListDto: dtoType.MngCodeDTO[] = await prismaProcess
        .findMany(whereClause)
        .then((datas: daoType.MngCode[]) => datas.map((code: daoType.MngCode) => daoToDto(code)));
    return mngCodeMlService.setMlDatas(retListDto, mlList);
}

export async function getDetail(data: dtoType.MngCodeDTO) {
    const dataDao: daoType.MngCode = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const mlList: dtoType.MngCodeMlDTO[] = await mngCodeMlService.getList({});
    const retDto: dtoType.MngCodeDTO | null = await prismaProcess
        .findUnique(whereClause)
        .then((data: daoType.MngCode | null) => (data !== null ? daoToDto(data) : null));
    return retDto != null ? mngCodeMlService.setMlData(retDto, mlList) : retDto;
}

export async function setInsert(data: dtoType.MngCodeDTO) {
    // data 저장
    const mlInfoList = data.ml_info;

    const dataDao: daoType.MngCode = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const createDao: daoType.MngCodeBase = convertUtil.dataCopy(daoValue.mngCodeBase, dataDao);
    const retDto: dtoType.MngCodeDTO = await prismaProcess
        .upsert({
            ...whereClause,
            update: dataDao,
            create: createDao
        })
        .then((data: daoType.MngCode) => daoToDto(data));
    // mlInfo 저장
    if (mlInfoList && mlInfoList.length > 0) {
        const retMlDatas: dtoType.MngCodeMlDTO[] = await mngCodeMlService.setUpdateMlDatas(mlInfoList);
        retDto.ml_info = retMlDatas;
    }
    return retDto;
}

export async function setUpdate(data: dtoType.MngCodeDTO) {
    // data 수정
    // mlInfo 수정
    return await setInsert(data);
}

export async function setDelete(data: dtoType.MngCodeDTO) {
    // data 삭제
    const dataDao = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngCodeDTO = await prismaProcess
        .delete(whereClause)
        .then((data: daoType.MngCode) => daoToDto(data));

    if (retDto) {
        const mlDto: daoType.MngCodeMl = convertUtil.dataCopy(mlDtoValue.mngCodeMlDTO, {
            grp_cd: retDto.grp_cd,
            cd: retDto.cd
        });
        const deleteDatas: daoType.MngCodeMl[] = await mngCodeMlService.setDeleteMlDatas(mlDto);
        retDto.ml_info = deleteDatas;
    }

    return retDto;
}
