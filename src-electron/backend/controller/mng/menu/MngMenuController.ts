import * as mngMenuService from '@be/service/mng/menu/mngMenuService';
import * as dtoType from '@cm/types/domain/dto/mng/mngMenuDTO';
import dayjs from 'dayjs';
import { IpcMainEvent, type IpcMain } from 'electron';

const returnPostFix = 'return';
const channelName = {
    count: 'mng_menu_count',
    list: 'mng_menu_list',
    allList: 'mng_menu_all_list',
    detail: 'mng_menu_detail',
    insert: 'mng_menu_insert',
    update: 'mng_menu_update',
    delete: 'mng_menu_delete'
};

const returnValue = (
    channel: string,
    evt: IpcMainEvent,
    retVal: null | number | dtoType.MngMenuDTO | dtoType.MngMenuDTO[]
) => {
    const retChannelName = [channel, returnPostFix].join('_');
    evt.sender.send(retChannelName, retVal);
};

export function mngMenuIpcSetter(ipcMain: IpcMain) {
    ipcMain.on(channelName.count, (evt: IpcMainEvent, search: dtoType.SearchMngMenuDTO) => {
        return count(search).then((value) => returnValue(channelName.count, evt, value));
    });
    ipcMain.on(channelName.list, (evt: IpcMainEvent, search: dtoType.SearchMngMenuDTO) => {
        return list(search).then((value) => returnValue(channelName.list, evt, value));
    });
    ipcMain.on(channelName.allList, (evt: IpcMainEvent, search: dtoType.SearchMngMenuDTO) => {
        return listAll(search).then((value) => returnValue(channelName.allList, evt, value));
    });
    ipcMain.on(channelName.detail, (evt: IpcMainEvent, data: dtoType.MngMenuDTO) => {
        return detail(data).then((value) => returnValue(channelName.detail, evt, value));
    });
    ipcMain.on(channelName.insert, (evt: IpcMainEvent, data: dtoType.MngMenuDTO) => {
        return insertData(data).then((value) => returnValue(channelName.insert, evt, value));
    });
    ipcMain.on(channelName.update, (evt: IpcMainEvent, data: dtoType.MngMenuDTO) => {
        return updateData(data).then((value) => returnValue(channelName.update, evt, value));
    });
    ipcMain.on(channelName.delete, (evt: IpcMainEvent, data: dtoType.MngMenuDTO) => {
        return deleteData(data).then((value) => returnValue(channelName.delete, evt, value));
    });
}

export async function count(search: dtoType.SearchMngMenuDTO) {
    const ret = await mngMenuService.getCount(search);
    return ret;
}

export async function list(search: dtoType.SearchMngMenuDTO) {
    const whereClauseOptions = { paging: true };
    const ret = await mngMenuService.getList(search, whereClauseOptions);
    return ret;
}

export async function listAll(search: dtoType.SearchMngMenuDTO) {
    // paging 상관없이 조건에 맞는 모든 데이터 조회
    const ret = await mngMenuService.getList(search);
    return ret;
}

export async function detail(data: dtoType.MngMenuDTO) {
    const ret = await mngMenuService.getDetail(data);
    return ret;
}

export async function insertData(data: dtoType.MngMenuDTO) {
    const ret = await mngMenuService.setInsert(data);
    return ret;
}

export async function updateData(data: dtoType.MngMenuDTO) {
    const ret = await mngMenuService.setUpdate(data);
    return ret;
}

export async function deleteData(data: dtoType.MngMenuDTO) {
    const ret = await mngMenuService.setDelete(data);
    return ret;
}

const initMenuData: dtoType.MngMenuDTO[] = [
    {
        id: 1,
        menu_id: '000000',
        menu_nm: 'Root',
        menu_url: 'subdir',
        menu_dc: 'Root',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '00',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 1,
                parent_id: 1,
                menu_id: '000000',
                lang_cd: 'EN',
                name: 'Root',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 2,
        menu_id: '100000',
        menu_nm: 'Variable',
        menu_url: '/npg/variable/list',
        menu_dc: 'Variable',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '10',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 2,
                parent_id: 2,
                menu_id: '100000',
                lang_cd: 'EN',
                name: 'Variable',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 3,
        menu_id: '200000',
        menu_nm: 'Rule',
        menu_url: 'subdir',
        menu_dc: 'Rule',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '20',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 3,
                parent_id: 3,
                menu_id: '200000',
                lang_cd: 'EN',
                name: 'Rule',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 4,
        menu_id: '201000',
        menu_nm: 'Rule',
        menu_url: '/npg/rule/rule/list',
        menu_dc: 'Rule',
        up_menu_id: '200000',
        menu_icon_class: '',
        sort_order: '21',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 4,
                parent_id: 4,
                menu_id: '201000',
                lang_cd: 'EN',
                name: 'Rule',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 5,
        menu_id: '202000',
        menu_nm: 'RuleSet',
        menu_url: '/npg/rule/ruleset/list',
        menu_dc: 'Ruleset',
        up_menu_id: '200000',
        menu_icon_class: '',
        sort_order: '22',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 5,
                parent_id: 5,
                menu_id: '202000',
                lang_cd: 'EN',
                name: 'RuleSet',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 6,
        menu_id: '300000',
        menu_nm: 'Module',
        menu_url: '/npg/module/list',
        menu_dc: 'Module',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '30',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 6,
                parent_id: 6,
                menu_id: '300000',
                lang_cd: 'EN',
                name: 'Module',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 7,
        menu_id: '400000',
        menu_nm: 'Policy',
        menu_url: '/npg/policy/list',
        menu_dc: 'policy',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '40',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 7,
                parent_id: 7,
                menu_id: '400000',
                lang_cd: 'EN',
                name: 'Policy',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 8,
        menu_id: '900000',
        menu_nm: 'System Mng.',
        menu_url: 'subdir',
        menu_dc: 'System Management',
        up_menu_id: '000000',
        menu_icon_class: '',
        sort_order: '90',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 8,
                parent_id: 8,
                menu_id: '900000',
                lang_cd: 'EN',
                name: 'System Mng.',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 9,
        menu_id: '901000',
        menu_nm: 'Code',
        menu_url: 'subdir',
        menu_dc: 'Code Management',
        up_menu_id: '900000',
        menu_icon_class: '',
        sort_order: '91',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 9,
                parent_id: 9,
                menu_id: '901000',
                lang_cd: 'EN',
                name: 'Code',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 10,
        menu_id: '901100',
        menu_nm: 'Group Code',
        menu_url: '/mng/grpcode/list',
        menu_dc: 'Code-GroupCode Management',
        up_menu_id: '901000',
        menu_icon_class: '',
        sort_order: '1',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 10,
                parent_id: 10,
                menu_id: '901100',
                lang_cd: 'EN',
                name: 'Group Code',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 11,
        menu_id: '901200',
        menu_nm: 'Code',
        menu_url: '/mng/code/list',
        menu_dc: 'Code-Code Management',
        up_menu_id: '901000',
        menu_icon_class: '',
        sort_order: '2',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 11,
                parent_id: 11,
                menu_id: '901200',
                lang_cd: 'EN',
                name: 'Code',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    },
    {
        id: 12,
        menu_id: '902000',
        menu_nm: 'Menu',
        menu_url: '/mng/menu/list',
        menu_dc: 'Menu Management',
        up_menu_id: '900000',
        menu_icon_class: '',
        sort_order: '92',
        use_yn: 'Y',
        create_time: dayjs.utc().toDate(),
        modify_time: dayjs.utc().toDate(),
        ml_info: [
            {
                id: 12,
                parent_id: 12,
                menu_id: '902000',
                lang_cd: 'EN',
                name: 'Menu',
                create_time: dayjs.utc().toDate(),
                modify_time: dayjs.utc().toDate()
            }
        ],
        curr_lang_cd: 'en'
    }
];
