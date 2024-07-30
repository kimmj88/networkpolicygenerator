import * as dtoType from '@cm/types/domain/dao/mng/mngMenu';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngMenuMlBase: dtoType.MngMenuMlBase = {
    menu_id: '',
    lang_cd: '',
    name: ''
};

export const mngMenuMl: dtoType.MngMenuMl = {
    ...mngMenuMlBase,
    id: -1,
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};
