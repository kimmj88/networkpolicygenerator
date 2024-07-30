import { pageDomain } from '@cm/domain/common/pageDomain';
import { MngCodeMlDTO, SearchMngCodeMlDTO } from '@cm/types/domain/dto/mng/mngCodeDTO';
import dayjs from '@cm/utils/time/dayjs';

const currentTime = dayjs().utc();

export const mngCodeMlDTO: MngCodeMlDTO = {
    id: -1,
    grp_cd: '',
    cd: '',
    lang_cd: '',
    name: '',
    create_time: currentTime.toDate(),
    modify_time: currentTime.toDate()
};

export const searchMngCodeMlDTO: SearchMngCodeMlDTO = {
    // 검색 조건건
    grp_cd: '',
    cd: '',
    lang_cd: '',
    name: '',

    // paging 처리
    ...pageDomain
};
