import { pageDomain } from '@cm/domain/common/pageDomain';
import { MngMenuDTO, SearchMngMenuDTO } from '@cm/types/domain/dto/mng/mngMenuDTO';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngMenuDTO: MngMenuDTO = {
    id: -1,
    menu_id: '',
    menu_nm: '',
    menu_url: '',
    menu_dc: '',
    up_menu_id: '',
    menu_icon_class: '',
    sort_order: '',
    use_yn: 'Y',
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate(),

    ml_info: [],
    curr_lang_cd: 'en'
};

export const searchMngMenuDTO: SearchMngMenuDTO = {
    // 검색 조건
    menu_id: '',
    menu_nm: '',

    // 사용중 언어
    curr_lang_cd: 'en',

    // paging 처리
    ...pageDomain
};
