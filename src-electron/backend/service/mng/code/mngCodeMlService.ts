import * as multiLanguageService from '@be/service/common/multiLanguageService';
import * as daoValue from '@cm/domain/dao/mng/code/mngCodeMl';
import * as dtoValue from '@cm/domain/dto/mng/code/mngCodeMlDTO';
import { setMultiLanguageOptions } from '@cm/types/be/service/multilanguage/multiLanguage';
import * as daoType from '@cm/types/domain/dao/mng/mngCode';
import * as dtoType from '@cm/types/domain/dto/mng/mngCodeDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';
import { makeDbClause, type whereClauseOptions } from '@cm/utils/db/sqlite/whereClause';

import prisma from '@be/database/prismaClient';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prismaProcess: Prisma.MngCodeMlDelegate<DefaultArgs> = prisma.mngCodeMl;

// db field 명과 같게 작성
export const whereConditionSet: whereClauseOptions<dtoType.SearchMngCodeMlDTO>['operator'] = {
    grp_cd: 'contains',
    cd: 'contains',
    lang_cd: 'equals',
    name: 'contains'
};

const whereConditionDefault: whereClauseOptions<dtoType.SearchMngCodeMlDTO> = {
    operator: whereConditionSet
};

export function dtoToDao(dto: dtoType.MngCodeMlDTO, exclude?: string[]) {
    return convertUtil.dataCopy(daoValue.mngCodeMl, dto, exclude);
}
export function daoToDto(dao: daoType.MngCodeMl, exclude?: string[]) {
    return convertUtil.dataCopy(dtoValue.mngCodeMlDTO, dao, exclude);
}

export async function getCount(
    search: dtoType.SearchMngCodeMlDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngCodeMlDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    return await prismaProcess.findMany(whereClause).then((datas: daoType.MngCodeMl[]) => datas.length);
}

export async function getList(
    search: dtoType.SearchMngCodeMlDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngCodeMlDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    const retDto: dtoType.MngCodeMlDTO[] = await prismaProcess
        .findMany(whereClause)
        .then((datas: daoType.MngCodeMl[]) => datas.map((codeMl: daoType.MngCodeMl) => daoToDto(codeMl)));
    return retDto;
}

export async function getDetail(data: dtoType.MngCodeMlDTO) {
    const dataDao: daoType.MngCodeMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngCodeMlDTO | null = await prismaProcess
        .findUnique(whereClause)
        .then((data: daoType.MngCodeMl | null) => (data !== null ? daoToDto(data) : null));
    return retDto;
}

export async function setInsert(data: dtoType.MngCodeMlDTO) {
    // data 저장
    const dataDao: daoType.MngCodeMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const createData: daoType.MngCodeMlBase = convertUtil.dataCopy(daoValue.mngCodeMlBase, dataDao);
    const retDto: dtoType.MngCodeMlDTO = await prismaProcess
        .upsert({
            ...whereClause,
            update: dataDao,
            create: createData
        })
        .then((data: daoType.MngCodeMl) => daoToDto(data));
    return retDto;
}

export async function setUpdate(data: dtoType.MngCodeMlDTO) {
    // data 수정
    return await setInsert(data);
}

export async function setDelete(data: dtoType.MngCodeMlDTO) {
    // data 삭제
    const dataDao: daoType.MngCodeMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngCodeMlDTO = await prismaProcess
        .delete(whereClause)
        .then((data: daoType.MngCodeMl) => daoToDto(data));
    return retDto;
}

export async function setUpdateMlDatas(datas: dtoType.MngCodeMlDTO[]) {
    const retDataArr: dtoType.MngCodeMlDTO[] = [];
    const excludeKey = ['create_time', 'modify_time'];
    datas?.forEach(async (ml: dtoType.MngCodeMlDTO) => {
        const dataDao = dtoToDao(ml, excludeKey);
        const createDao: daoType.MngCodeMlBase = convertUtil.dataCopy(daoValue.mngCodeMlBase, dataDao, excludeKey);
        const retMlInfo = await prismaProcess.upsert({
            where: {
                id: dataDao.id
            },
            update: dataDao,
            create: createDao
        });
        retDataArr.push(retMlInfo as dtoType.MngCodeMlDTO);
    });
    return retDataArr;
}

export async function setDeleteMlDatas(data: dtoType.MngCodeMlDTO) {
    // datas 삭제
    const whereClause = makeDbClause({ grp_cd: data.grp_cd, cd: data.cd });
    const deleteDatas: daoType.MngCodeMl[] = await prismaProcess
        .findMany(whereClause)
        .then((mlList: daoType.MngCodeMl[]) => mlList.map((ml: daoType.MngCodeMl) => daoToDto(ml)));
    const cnt = await prismaProcess.deleteMany(whereClause);
    console.log('Delete Data Count => ', cnt);
    return deleteDatas;
}

export async function setMlData(codeDto: dtoType.MngCodeDTO, codeMlDtoList: dtoType.MngCodeMlDTO[]) {
    // let mlInfo: dtoType.MngCodeMlDTO[] = [];
    // codeMlDtoList
    //     .filter((codeMl: dtoType.MngCodeMlDTO) => codeMl.grp_cd === codeDto.grp_cd && codeMl.cd === codeDto.cd)
    //     .forEach((ml: dtoType.MngCodeMlDTO) => mlInfo.push(ml));

    // codeDto.ml_info = mlInfo;
    // return codeDto;
    const options: setMultiLanguageOptions = {
        filter: { grp_cd: 'grp_cd', cd: 'cd' },
        target: 'ml_info'
    };
    return multiLanguageService.setMlData(codeDto, codeMlDtoList, options);
}

export async function setMlDatas(codeDtoList: dtoType.MngCodeDTO[], codeMlDtoList: dtoType.MngCodeMlDTO[]) {
    // let retCodeList: dtoType.MngCodeDTO[] = [];
    // codeDtoList.forEach(async (codeDto: dtoType.MngCodeDTO) => {
    //     const mlData: dtoType.MngCodeDTO = await setMlData(codeDto, codeMlDtoList);
    //     retCodeList.push(mlData);
    // });
    // return retCodeList;
    const options: setMultiLanguageOptions = {
        filter: { grp_cd: 'grp_cd', cd: 'cd' },
        target: 'ml_info'
    };
    return multiLanguageService.setMlDatas(codeDtoList, codeMlDtoList, options);
}
