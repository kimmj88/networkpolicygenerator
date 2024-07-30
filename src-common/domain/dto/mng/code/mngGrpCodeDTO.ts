import { pageDomain } from '@cm/domain/common/pageDomain';
import { MngGrpCodeDTO, SearchMngGrpCodeDTO } from '@cm/types/domain/dto/mng/mngCodeDTO';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngGrpCodeDTO: MngGrpCodeDTO = {
    id: -1,
    grp_cd: '',
    grp_cd_nm: '',
    grp_cd_dc: '',
    use_yn: 'Y',
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};

export const searchMngGrpCodeDTO: SearchMngGrpCodeDTO = {
    // 검색 조건건
    grp_cd: '',
    grp_cd_nm: '',

    ...pageDomain
};
