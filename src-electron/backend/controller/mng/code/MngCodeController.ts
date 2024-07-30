import * as mngCodeService from '@be/service/mng/code/mngCodeService';
import * as dtoType from '@cm/types/domain/dto/mng/mngCodeDTO';
import { IpcMainEvent, IpcMainInvokeEvent, type IpcMain } from 'electron';

const returnPostFix = 'return';
const channelName = {
    count: 'mng_code_count',
    list: 'mng_code_list',
    lists: 'mng_code_lists',
    allList: 'mng_code_all_list',
    detail: 'mng_code_detail',
    insert: 'mng_code_insert',
    update: 'mng_code_update',
    delete: 'mng_code_delete'
};

const returnValue = (channel: string, evt: IpcMainEvent | IpcMainInvokeEvent, retVal: any) => {
    const retChannelName = [channel, returnPostFix].join('_');
    evt.sender.send(retChannelName, retVal);
};

export function mngCodeIpcSetter(ipcMain: IpcMain) {
    ipcMain.on(channelName.count, (evt: IpcMainEvent, search: dtoType.SearchMngCodeDTO) => {
        return count(search).then((value) => returnValue(channelName.count, evt, value));
    });
    ipcMain.on(channelName.list, (evt: IpcMainEvent, search: dtoType.SearchMngCodeDTO) => {
        return list(search).then((value) => returnValue(channelName.list, evt, value));
    });
    ipcMain.on(channelName.lists, async (evt: IpcMainEvent, search: dtoType.SearchMngCodeDTO) => {
        let grpCds = search?.grp_cd?.split(',');
        let retData: { [x: string]: dtoType.MngCodeDTO[] } = {} as any;
        let PromiseList: Promise<dtoType.MngCodeDTO | dtoType.MngCodeDTO[]>[] = [];
        if (grpCds) {
            grpCds.forEach(async (elem: string) => {
                let searchObj: dtoType.SearchMngCodeDTO = { grp_cd: elem, use_yn: 'Y' };
                PromiseList.push(listAll(searchObj).then((value) => (retData[elem.toLowerCase()] = value)));
            });
            Promise.all(PromiseList).then(() => returnValue(channelName.lists, evt, retData));
        } else {
            returnValue(channelName.lists, evt, retData);
        }
    });
    ipcMain.on(channelName.allList, (evt: IpcMainEvent, search: dtoType.SearchMngCodeDTO) => {
        return listAll(search).then((value) => returnValue(channelName.allList, evt, value));
    });
    ipcMain.on(channelName.detail, (evt: IpcMainEvent, data: dtoType.MngCodeDTO) => {
        return detail(data).then((value) => returnValue(channelName.detail, evt, value));
    });
    ipcMain.on(channelName.insert, (evt: IpcMainEvent, data: dtoType.MngCodeDTO) => {
        return insertData(data).then((value) => returnValue(channelName.insert, evt, value));
    });
    ipcMain.on(channelName.update, (evt: IpcMainEvent, data: dtoType.MngCodeDTO) => {
        return updateData(data).then((value) => returnValue(channelName.update, evt, value));
    });
    ipcMain.on(channelName.delete, (evt: IpcMainEvent, data: dtoType.MngCodeDTO) => {
        return deleteData(data).then((value) => returnValue(channelName.delete, evt, value));
    });
}

export async function count(search: dtoType.SearchMngCodeDTO) {
    const ret = await mngCodeService.getCount(search);
    return ret;
}

export async function list(search: dtoType.SearchMngCodeDTO) {
    const whereClauseOptions = { paging: true };
    const ret = await mngCodeService.getList(search, whereClauseOptions);
    return ret;
}

export async function listAll(search: dtoType.SearchMngCodeDTO) {
    // paging 상관없이 조건에 맞는 모든 데이터 조회
    return await mngCodeService.getList(search);
}

export async function detail(data: dtoType.MngCodeDTO) {
    const ret = await mngCodeService.getDetail(data);
    return ret;
}

export async function insertData(data: dtoType.MngCodeDTO) {
    const ret = await mngCodeService.setInsert(data);
    return ret;
}

export async function updateData(data: dtoType.MngCodeDTO) {
    const ret = await mngCodeService.setUpdate(data);
    return ret;
}

export async function deleteData(data: dtoType.MngCodeDTO) {
    const ret = await mngCodeService.setDelete(data);
    return ret;
}
