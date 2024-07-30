import * as dtoType from '@cm/types/domain/dao/mng/mngCode';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngGrpCodeBase: dtoType.MngGrpCodeBase = {
    grp_cd: '',
    grp_cd_nm: '',
    grp_cd_dc: '',
    use_yn: 'Y'
};

export const mngGrpCode: dtoType.MngGrpCode = {
    ...mngGrpCodeBase,
    id: -1,
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};
