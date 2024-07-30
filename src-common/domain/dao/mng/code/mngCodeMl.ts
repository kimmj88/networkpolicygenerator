import * as dtoType from '@cm/types/domain/dao/mng/mngCode';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngCodeMlBase: dtoType.MngCodeMlBase = {
    grp_cd: '',
    cd: '',
    lang_cd: '',
    name: ''
};

export const mngCodeMl: dtoType.MngCodeMl = {
    ...mngCodeMlBase,
    id: -1,
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};
