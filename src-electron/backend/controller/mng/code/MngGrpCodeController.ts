import * as mngGrpCodeService from '@be/service/mng/code/mngGrpCodeService';
import * as dtoType from '@cm/types/domain/dto/mng/mngCodeDTO';
import { IpcMainEvent, type IpcMain } from 'electron';

const returnPostFix = 'return';
const channelName = {
    count: 'mng_grp_code_count',
    list: 'mng_grp_code_list',
    allList: 'mng_grp_code_all_list',
    detail: 'mng_grp_code_detail',
    insert: 'mng_grp_code_insert',
    update: 'mng_grp_code_update',
    delete: 'mng_grp_code_delete'
};

const returnValue = (channel: string, evt: IpcMainEvent, retVal: any) => {
    const retChannelName = [channel, returnPostFix].join('_');
    evt.sender.send(retChannelName, retVal);
};

export function mngGrpCodeIpcSetter(ipcMain: IpcMain) {
    ipcMain.on(channelName.count, (evt: IpcMainEvent, search: dtoType.SearchMngGrpCodeDTO) => {
        return count(search).then((value) => returnValue(channelName.count, evt, value));
    });
    ipcMain.on(channelName.list, (evt: IpcMainEvent, search: dtoType.SearchMngGrpCodeDTO) => {
        return list(search).then((value) => returnValue(channelName.list, evt, value));
    });
    ipcMain.on(channelName.allList, (evt: IpcMainEvent, search: dtoType.SearchMngGrpCodeDTO) => {
        return listAll(search).then((value) => returnValue(channelName.allList, evt, value));
    });
    ipcMain.on(channelName.detail, (evt: IpcMainEvent, data: dtoType.MngGrpCodeDTO) => {
        return detail(data).then((value) => returnValue(channelName.detail, evt, value));
    });
    ipcMain.on(channelName.insert, (evt: IpcMainEvent, data: dtoType.MngGrpCodeDTO) => {
        return insertData(data).then((value) => returnValue(channelName.insert, evt, value));
    });
    ipcMain.on(channelName.update, (evt: IpcMainEvent, data: dtoType.MngGrpCodeDTO) => {
        return updateData(data).then((value) => returnValue(channelName.update, evt, value));
    });
    ipcMain.on(channelName.delete, (evt: IpcMainEvent, data: dtoType.MngGrpCodeDTO) => {
        return deleteData(data).then((value) => returnValue(channelName.delete, evt, value));
    });
}

export async function count(search: dtoType.SearchMngGrpCodeDTO) {
    const ret = await mngGrpCodeService.getCount(search);
    return ret;
}

export async function list(search: dtoType.SearchMngGrpCodeDTO) {
    const whereClauseOptions = { paging: true };
    const ret = await mngGrpCodeService.getList(search, whereClauseOptions);
    return ret;
}

export async function listAll(search: dtoType.SearchMngGrpCodeDTO) {
    // paging 상관없이 조건에 맞는 모든 데이터 조회
    const ret = await mngGrpCodeService.getList(search);
    return ret;
}

export async function detail(data: dtoType.MngGrpCodeDTO) {
    const ret = await mngGrpCodeService.getDetail(data);
    return ret;
}

export async function insertData(data: dtoType.MngGrpCodeDTO) {
    const ret = await mngGrpCodeService.setInsert(data);
    return ret;
}

export async function updateData(data: dtoType.MngGrpCodeDTO) {
    const ret = await mngGrpCodeService.setUpdate(data);
    return ret;
}

export async function deleteData(data: dtoType.MngGrpCodeDTO) {
    const ret = await mngGrpCodeService.setDelete(data);
    return ret;
}
