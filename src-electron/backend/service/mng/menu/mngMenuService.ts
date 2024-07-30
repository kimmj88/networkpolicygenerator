import * as mngMenuMlService from '@be/service/mng/menu/mngMenuMlService';
import * as daoValue from '@cm/domain/dao/mng/menu/mngMenu';
import * as dtoValue from '@cm/domain/dto/mng/menu/mngMenuDTO';
import * as daoType from '@cm/types/domain/dao/mng/mngMenu';
import * as dtoType from '@cm/types/domain/dto/mng/mngMenuDTO';
import * as convertUtil from '@cm/utils/ConvertUtil';
import { makeDbClause, type whereClauseOptions } from '@cm/utils/db/sqlite/whereClause';

import prisma from '@be/database/prismaClient';
import { Prisma } from '@prisma/client';
import { DefaultArgs } from '@prisma/client/runtime/library';

const prismaProcess: Prisma.MngMenuDelegate<DefaultArgs> = prisma.mngMenu;

// db field 명과 같게 작성
const whereConditionSet: whereClauseOptions<dtoType.SearchMngMenuDTO>['operator'] = {
    menu_id: 'contains',
    menu_nm: 'contains'
};

const whereConditionDefault: whereClauseOptions<dtoType.SearchMngMenuDTO> = {
    operator: whereConditionSet,
    include: {
        _count: true,
        ml_info: true
    }
};

export function dtoToDao(dto: dtoType.MngMenuDTO, exclude?: string[]) {
    return convertUtil.dataCopy(daoValue.mngMenu, dto, exclude);
}
export function daoToDto(dao: daoType.MngMenu, exclude?: string[]) {
    return convertUtil.dataCopy(dtoValue.mngMenuDTO, dao, exclude);
}

export async function getCount(
    search: dtoType.SearchMngMenuDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngMenuDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    delete whereClause.include;
    return await prismaProcess.count(whereClause);
}

export async function getList(
    search: dtoType.SearchMngMenuDTO,
    whereClauseOptions?: whereClauseOptions<dtoType.SearchMngMenuDTO>
) {
    const whereClause = makeDbClause(search, whereClauseOptions, whereConditionDefault);
    // const mlList: dtoType.MngMenuMlDTO[] = await mngMenuMlService.getList({});
    // const retListDto: dtoType.MngMenuDTO[] = await prismaProcess
    //     .findMany(whereClause)
    //     .then((datas: daoType.MngMenu[]) => datas.map((menu: daoType.MngMenu) => daoToDto(menu)));
    // return mngMenuMlService.setMlDatas(retListDto, mlList);
    return await prismaProcess
        .findMany(whereClause)
        .then((datas: daoType.MngMenu[]) => datas.map((menu: daoType.MngMenu) => daoToDto(menu)));
}

export async function getDetail(data: dtoType.MngMenuDTO) {
    const dataDao: daoType.MngMenu = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id }, whereConditionDefault);
    // const mlList: dtoType.MngMenuMlDTO[] = await mngMenuMlService.getList({});
    // const retDto: dtoType.MngMenuDTO | null = await prismaProcess
    //     .findUnique(whereClause)
    //     .then((data: daoType.MngMenu | null) => (data !== null ? daoToDto(data) : null));
    // return retDto != null ? mngMenuMlService.setMlData(retDto, mlList) : retDto;
    return await prismaProcess
        .findUnique(whereClause)
        .then((data: daoType.MngMenu | null) => (data !== null ? daoToDto(data) : null));
}

export async function setInsert(data: dtoType.MngMenuDTO) {
    // data 저장
    const mlInfoList = data.ml_info;

    const dataDao: daoType.MngMenu = dtoToDao(data);
    // mlInfo 저장
    if (mlInfoList && mlInfoList.length > 0) {
        const retMlDatas = await mngMenuMlService.convertMlDatasToDao('upsert', mlInfoList);
        dataDao.ml_info = retMlDatas;
    }

    const whereClause = makeDbClause({ id: dataDao.id }, whereConditionDefault);
    const createDao: daoType.MngMenuBase = convertUtil.dataCopy(daoValue.mngMenuBase, dataDao);
    const retDto = await prismaProcess
        .upsert({
            ...whereClause,
            update: dataDao,
            create: createDao
        })
        .then((data: daoType.MngMenu) => daoToDto(data));

    // // mlInfo 저장
    // if (mlInfoList && mlInfoList.length > 0) {
    //     const retMlDatas: dtoType.MngMenuMlDTO[] = await mngMenuMlService.setUpdateMlDatas(mlInfoList);
    //     retDto.ml_info = retMlDatas;
    // }
    return retDto;
}

export async function setUpdate(data: dtoType.MngMenuDTO) {
    // data 수정
    // mlInfo 수정
    return await setInsert(data);
}

export async function setDelete(data: dtoType.MngMenuDTO) {
    // data 삭제
    // const dataDao: daoType.MngMenu = dtoToDao(data);
    // const whereClause = makeDbClause({ id: dataDao.id });
    // const retDto: dtoType.MngMenuDTO = await prismaProcess
    //     .delete(whereClause)
    //     .then((data: daoType.MngMenu) => daoToDto(data));

    // if (retDto) {
    //     const mlDto: daoType.MngMenuMl = convertUtil.dataCopy(mlDtoValue.mngMenuMlDTO, {
    //         menu_id: retDto.menu_id
    //     });
    //     const deleteDatas: daoType.MngMenuMl[] = await mngMenuMlService.setDeleteMlDatas(mlDto);
    //     retDto.ml_info = deleteDatas;
    // }
    const dataDao: daoType.MngMenu = dtoToDao(data);
    const whereClause = makeDbClause({ id: dataDao.id });
    const retDto: dtoType.MngMenuDTO = await prismaProcess
        .delete(whereClause)
        .then((data: daoType.MngMenu) => daoToDto(data));

    return retDto;
}
