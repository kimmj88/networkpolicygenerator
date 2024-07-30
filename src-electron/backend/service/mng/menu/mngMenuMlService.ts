import * as multiLanguageService from '@be/service/common/multiLanguageService';
import * as daoValue from '@cm/domain/dao/mng/menu/mngMenuMl';
import * as dtoValue from '@cm/domain/dto/mng/menu/mngMenuMlDTO';
import { setMultiLanguageOptions } from '@cm/types/be/service/multilanguage/multiLanguage';
import * as daoType from '@cm/types/domain/dao/mng/mngMenu';
import * as dtoType from '@cm/types/domain/dto/mng/mngMenuDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';
import { makeDbClause, type whereClauseOptions } from '@cm/utils/db/sqlite/whereClause';

import prisma from '@be/database/prismaClient';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prismaProcess: Prisma.MngMenuMlDelegate<DefaultArgs> = prisma.mngMenuMl;

// db field 명과 같게 작성
export const whereConditionSet: whereClauseOptions<dtoType.SearchMngMenuMlDTO>['operator'] = {
    menu_id: 'contains',
    lang_cd: 'equals',
    name: 'contains'
};

const whereConditionDefault: whereClauseOptions<dtoType.SearchMngMenuMlDTO> = {
    operator: whereConditionSet
};

export function dtoToDao(dto: dtoType.MngMenuMlDTO, exclude?: string[]) {
    return convertUtil.dataCopy(daoValue.mngMenuMl, dto, exclude);
}
export function daoToDto(dao: daoType.MngMenuMl, exclude?: string[]) {
    return convertUtil.dataCopy(dtoValue.mngMenuMlDTO, dao, exclude);
}

export async function getCount(
    search: dtoType.SearchMngMenuMlDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngMenuMlDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    return await prismaProcess.findMany(whereClause).then((datas: daoType.MngMenuMl[]) => datas.length);
}

export async function getList(
    search: dtoType.SearchMngMenuMlDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngMenuMlDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    const retDto = await prismaProcess
        .findMany(whereClause)
        .then((datas: daoType.MngMenuMl[]) => datas.map((menuMl: daoType.MngMenuMl) => daoToDto(menuMl)));
    return retDto;
}

export async function getDetail(data: dtoType.MngMenuMlDTO) {
    const dataDao: daoType.MngMenuMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngMenuMlDTO | null = await prismaProcess
        .findUnique(whereClause)
        .then((data: daoType.MngMenuMl | null) => (data !== null ? daoToDto(data) : null));
    return retDto;
}

export async function setInsert(data: dtoType.MngMenuMlDTO) {
    // data 저장
    const dataDao: daoType.MngMenuMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const createData: daoType.MngMenuMlBase = convertUtil.dataCopy(daoValue.mngMenuMlBase, dataDao);
    const retDto: dtoType.MngMenuMlDTO = await prismaProcess
        .upsert({
            ...whereClause,
            update: dataDao,
            create: createData
        })
        .then((data: daoType.MngMenuMl) => daoToDto(data));
    return retDto;
}

export async function setUpdate(data: dtoType.MngMenuMlDTO) {
    // data 수정
    const retData = await setInsert(data);
    return retData;
}

export async function setDelete(data: dtoType.MngMenuMlDTO) {
    // data 삭제
    const dataDao: daoType.MngMenuMl = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngMenuMlDTO = await prismaProcess
        .delete(whereClause)
        .then((data: daoType.MngMenuMl) => daoToDto(data));
    return retDto;
}

export async function convertMlDatasToDao(type: string, datas: dtoType.MngMenuMlDTO[]) {
    const retDataArr = [] as any;
    const excludeKey = ['create_time', 'modify_time'];
    datas?.forEach(async (ml: dtoType.MngMenuMlDTO) => {
        const dataDao = dtoToDao(ml, excludeKey);
        const createDao: daoType.MngMenuMlBase = convertUtil.dataCopy(daoValue.mngMenuMlBase, dataDao, excludeKey);
        const data = {
            where: {
                id: dataDao.id
            },
            update: dataDao,
            create: createDao
        };
        retDataArr.push(data);
    });
    let retData: { [x: string]: any } = {};
    retData[type] = retDataArr;
    return retData;
}

export async function setUpdateMlDatas(datas: dtoType.MngMenuMlDTO[]) {
    const retDataArr: dtoType.MngMenuMlDTO[] = [];
    const excludeKey = ['create_time', 'modify_time'];
    datas?.forEach(async (ml: dtoType.MngMenuMlDTO) => {
        const dataDao = dtoToDao(ml, excludeKey);
        const createDao: daoType.MngMenuMlBase = convertUtil.dataCopy(daoValue.mngMenuMlBase, dataDao, excludeKey);
        const retMlInfo = await prismaProcess.upsert({
            where: {
                id: dataDao.id
            },
            update: dataDao,
            create: createDao
        });
        retDataArr.push(retMlInfo as dtoType.MngMenuMlDTO);
    });
    return retDataArr;
}

export async function setDeleteMlDatas(data: dtoType.MngMenuMlDTO) {
    // datas 삭제
    const whereClause = makeDbClause({ menu_id: data.menu_id });
    const deleteDatas: daoType.MngMenuMl[] = await prismaProcess
        .findMany(whereClause)
        .then((mlList: daoType.MngMenuMl[]) => mlList.map((ml: daoType.MngMenuMl) => daoToDto(ml)));
    const cnt = await prismaProcess.deleteMany(whereClause);
    console.log('Delete Data Count => ', cnt);
    return deleteDatas;
}

export function setMlData(menuDto: dtoType.MngMenuDTO, menuMlDtoList: dtoType.MngMenuMlDTO[]) {
    const options: setMultiLanguageOptions = {
        filter: { menu_id: 'menu_id' },
        target: 'ml_info'
    };
    return multiLanguageService.setMlData(menuDto, menuMlDtoList, options);
}

export function setMlDatas(menuDtoList: dtoType.MngMenuDTO[], menuMlDtoList: dtoType.MngMenuMlDTO[]) {
    const options: setMultiLanguageOptions = {
        filter: { menu_id: 'menu_id' },
        target: 'ml_info'
    };
    return multiLanguageService.setMlDatas(menuDtoList, menuMlDtoList, options);
}
