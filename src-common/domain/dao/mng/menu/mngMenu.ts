import * as dtoType from '@cm/types/domain/dao/mng/mngMenu';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngMenuBase: dtoType.MngMenuBase = {
    menu_id: '',
    menu_nm: '',
    menu_url: '',
    menu_dc: '',
    up_menu_id: '',
    menu_icon_class: '',
    sort_order: '',
    use_yn: 'Y'
};

export const mngMenu: dtoType.MngMenu = {
    ...mngMenuBase,
    id: -1,
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};
