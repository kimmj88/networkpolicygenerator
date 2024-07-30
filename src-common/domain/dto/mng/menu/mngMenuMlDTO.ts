// import dayjs from 'dayjs'

import { pageDomain } from '@cm/domain/common/pageDomain';
import { MngMenuMlDTO, SearchMngMenuMlDTO } from '@cm/types/domain/dto/mng/mngMenuDTO';

// const currentTime = dayjs().utc()

export const mngMenuMlDTO: MngMenuMlDTO = {
    id: -1,
    parent_id: -1,
    menu_id: '',
    lang_cd: '',
    name: '',
    create_time: new Date(),
    modify_time: new Date()
};

export const searchMngMenuMlDTO: SearchMngMenuMlDTO = {
    // 검색 조건
    menu_id: '',
    lang_cd: '',
    name: '',

    // paging 처리
    ...pageDomain
};
