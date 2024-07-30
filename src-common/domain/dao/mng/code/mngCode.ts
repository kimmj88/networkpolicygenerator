import * as dtoType from '@cm/types/domain/dao/mng/mngCode';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngCodeBase: dtoType.MngCodeBase = {
    grp_cd: '',
    cd: '',
    cd_nm: '',
    cd_dc: '',
    item1: '',
    item2: '',
    item3: '',
    item4: '',
    item5: '',
    sort_order: '',
    use_yn: 'Y'
};

export const mngCode: dtoType.MngCode = {
    ...mngCodeBase,
    id: -1,
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};
