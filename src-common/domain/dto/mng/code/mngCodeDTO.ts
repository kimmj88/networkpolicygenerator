import { pageDomain } from '@cm/domain/common/pageDomain';
import { MngCodeDTO, SearchMngCodeDTO } from '@cm/types/domain/dto/mng/mngCodeDTO';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngCodeDTO: MngCodeDTO = {
    id: -1,
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
    use_yn: 'Y',
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate(),

    ml_info: [],
    curr_lang_cd: 'en'
};

export const searchMngCodeDTO: SearchMngCodeDTO = {
    // 검색 조건건
    grp_cd: '',
    cd: '',
    cd_nm: '',
    // 사용중 언어
    curr_lang_cd: 'en',

    // paging 처리
    ...pageDomain
};
